use std::{
    collections::VecDeque,
    sync::{Arc, RwLock},
};

use axum::{http::StatusCode, routing::post, Json, Router};
use diesel_async::{
    pooled_connection::{deadpool::Pool, AsyncDieselConnectionManager},
    RunQueryDsl,
};
use dotenvy::dotenv;
use matchmaking::{models::Activegame, schema::activegames};
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
    pub tx: oneshot::Sender<Option<MatchResponse>>,
}

async fn matcher(mut rx: mpsc::Receiver<()>, player_queue: ConcurrentQueue<MatchingPlayer>) {
    let config = AsyncDieselConnectionManager::<diesel_async::AsyncPgConnection>::new(
        std::env::var("DATABASE_URL").expect("DATABASE_URL not present in .env"),
    );
    let pool = Pool::builder(config).build().unwrap();

    while let Some(_) = rx.recv().await {
        while player_queue.read().unwrap().len() >= 2 {
            let (player1, player2) = {
                let mut queue = player_queue.write().unwrap();
                (
                    queue.pop_front().expect("Player should exist"),
                    queue.pop_front().expect("Player should exist"),
                )
            };

            let game_id = uuid::Uuid::new_v4();

            let game_info = Activegame {
                gameid: game_id,
                black: player2.user_id.clone(),
                white: player1.user_id.clone(),
                createdat: None,
            };

            let mut conn = match pool.get().await {
                Ok(conn) => conn,
                Err(e) => {
                    tracing::error!("Error obtaining connection: {e}");
                    player1.tx.send(None).unwrap();
                    player2.tx.send(None).unwrap();
                    continue;
                }
            };

            if let Err(e) = diesel::insert_into(activegames::table)
                .values(game_info)
                .execute(&mut conn)
                .await
            {
                tracing::error!("Insertion failed: {e}");
                player1.tx.send(None).unwrap();
                player2.tx.send(None).unwrap();
                continue;
            }

            tracing::info!("Matched {} and {}", player1.user_id, player2.user_id);

            player1
                .tx
                .send(Some(MatchResponse {
                    game_id: game_id.to_string(),
                    color: Color::White,
                }))
                .unwrap();
            player2
                .tx
                .send(Some(MatchResponse {
                    game_id: game_id.to_string(),
                    color: Color::Black,
                }))
                .unwrap();
        }
    }
}

pub async fn post_match(
    notify_tx: mpsc::Sender<()>,
    player_queue: ConcurrentQueue<MatchingPlayer>,
    Json(body): Json<MatchRequest>,
) -> (StatusCode, Json<MatchResponse>) {
    let (res_tx, res_rx) = oneshot::channel();

    tracing::info!("User {} requests a match", body.user_id);

    // TODO: better error handling
    player_queue.write().unwrap().push_back(MatchingPlayer {
        user_id: body.user_id,
        tx: res_tx,
    });

    notify_tx.send(()).await.unwrap();

    match res_rx.await.unwrap() {
        Some(res) => (StatusCode::OK, Json(res)),
        None => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(MatchResponse {
                game_id: "".to_string(),
                color: Color::White,
            }),
        ),
    }
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    dotenv().ok();

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
