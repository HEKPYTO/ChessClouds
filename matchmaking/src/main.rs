use std::{
    collections::VecDeque,
    sync::{Arc, RwLock},
};

use axum::{routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use tokio::sync::{mpsc, oneshot};

const MAX_CHANNEL_SIZE: usize = 4096;
const HOST: &'static str = "0.0.0.0:8001";

type ConcurrentQueue<T> = Arc<RwLock<VecDeque<T>>>;

#[derive(Deserialize)]
pub struct MatchRequest {
    pub user_id: String,
}

#[derive(Serialize, Debug)]
pub enum Color {
    White,
    Black,
}

#[derive(Serialize, Debug)]
pub struct MatchResponse {
    pub game_id: String,
    pub color: Color,
}

pub struct MatchingPlayer {
    pub user_id: String,
    pub tx: oneshot::Sender<MatchResponse>,
}

async fn matcher(mut rx: mpsc::Receiver<()>, player_queue: ConcurrentQueue<MatchingPlayer>) {
    while let Some(_) = rx.recv().await {
        while player_queue.read().unwrap().len() >= 2 {
            let (player1, player2) = {
                let mut queue = player_queue.write().unwrap();
                (
                    queue.pop_front().expect("Player should exist"),
                    queue.pop_front().expect("Player should exist"),
                )
            };

            let game_id = uuid::Uuid::new_v4().to_string();

            tracing::info!("Matched {} and {}", player1.user_id, player2.user_id);

            // TODO: Create an active game in DB
            player1
                .tx
                .send(MatchResponse {
                    game_id: game_id.clone(),
                    color: Color::White,
                })
                .unwrap();
            player2
                .tx
                .send(MatchResponse {
                    game_id: game_id.clone(),
                    color: Color::Black,
                })
                .unwrap();
        }
    }
}

pub async fn post_match(
    notify_tx: mpsc::Sender<()>,
    player_queue: ConcurrentQueue<MatchingPlayer>,
    Json(body): Json<MatchRequest>,
) -> Json<MatchResponse> {
    let (res_tx, res_rx) = oneshot::channel();

    tracing::info!("User {} requests a match", body.user_id);

    // TODO: better error handling
    player_queue.write().unwrap().push_back(MatchingPlayer {
        user_id: body.user_id,
        tx: res_tx,
    });

    notify_tx.send(()).await.unwrap();

    let res = res_rx.await.unwrap();

    Json(res)
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let (notify_tx, notify_rx) = mpsc::channel(MAX_CHANNEL_SIZE);

    let player_queue = Arc::new(RwLock::new(VecDeque::<MatchingPlayer>::new()));

    let app = Router::new().route(
        "/match",
        post({
            let cloned_queue = player_queue.clone();
            move |body| post_match(notify_tx, cloned_queue, body)
        }),
    );

    tokio::spawn(matcher(notify_rx, player_queue.clone()));

    let listener = tokio::net::TcpListener::bind(HOST).await.unwrap();
    tracing::info!("Running at {HOST}");
    axum::serve(listener, app).await.unwrap();
}
