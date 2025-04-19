use std::{
    collections::VecDeque,
    env,
    sync::{Arc, Mutex},
};

use axum::{
    http::{header, Method, StatusCode},
    routing::post,
    Json, Router,
};
use dotenvy::dotenv;
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};
use tokio::sync::{mpsc, oneshot};
use tower_http::cors::{AllowOrigin, CorsLayer};
use ts_rs::TS;

const MAX_CHANNEL_SIZE: usize = 4096;
const HOST: &'static str = "0.0.0.0:8001";

type ConcurrentQueue<T> = Arc<Mutex<VecDeque<T>>>;

struct AutoDrop {
    user_id: String,
    queue: ConcurrentQueue<MatchingPlayer>,
}

impl Drop for AutoDrop {
    fn drop(&mut self) {
        tracing::info!(
            "User {} closed connection, removing matching player record",
            self.user_id
        );
        self.queue
            .lock()
            .unwrap()
            .retain(|x| x.user_id != self.user_id)
    }
}

#[derive(Deserialize, TS)]
#[ts(export)]
pub struct MatchRequest {
    pub user_id: String,
}

#[derive(Serialize, Debug, TS)]
#[ts(export)]
pub enum Color {
    White,
    Black,
}

#[derive(Serialize, Debug, TS)]
#[serde(tag = "result", content = "value")]
#[ts(export)]
pub enum MatchResponse {
    Ok { game_id: String, color: Color },
    Err(String),
}

impl MatchResponse {
    pub fn is_err(&self) -> bool {
        match self {
            MatchResponse::Err(_) => true,
            _ => false,
        }
    }
}

pub struct MatchingPlayer {
    pub user_id: String,
    pub tx: oneshot::Sender<MatchResponse>,
}

async fn matcher(
    mut rx: mpsc::Receiver<()>,
    player_queue: ConcurrentQueue<MatchingPlayer>,
    pool: Pool<Postgres>,
) {
    while let Some(_) = rx.recv().await {
        loop {
            let (player1, player2) = {
                let mut queue = player_queue.lock().unwrap();
                if queue.len() < 2 {
                    break;
                }
                (
                    queue.pop_front().expect("Player should exist"),
                    queue.pop_front().expect("Player should exist"),
                )
            };

            let game_id = uuid::Uuid::new_v4();

            if let Err(e) = sqlx::query!(
                r#"INSERT INTO GameState (GameID, Black, White) VALUES ($1, $2, $3)"#,
                game_id,
                player2.user_id,
                player1.user_id
            )
            .execute(&pool)
            .await
            {
                let _ = player1.tx.send(MatchResponse::Err(
                    format!("DB insertion failed: {e}]").to_string(),
                ));
                let _ = player2.tx.send(MatchResponse::Err(
                    format!("DB insertion failed: {e}").to_string(),
                ));
                continue;
            }

            tracing::info!("Matched {} and {}", player1.user_id, player2.user_id);

            if let Err(_) = player1.tx.send(MatchResponse::Ok {
                game_id: game_id.to_string(),
                color: Color::White,
            }) {
                tracing::error!("Connection closed unexpectedly, proceeding anyway");
            }
            if let Err(_) = player2.tx.send(MatchResponse::Ok {
                game_id: game_id.to_string(),
                color: Color::Black,
            }) {
                tracing::error!("Connection closed unexpectedly, proceeding anyway");
            }
        }
    }
}

pub async fn post_match(
    notify_tx: mpsc::Sender<()>,
    player_queue: ConcurrentQueue<MatchingPlayer>,
    Json(body): Json<MatchRequest>,
) -> (StatusCode, Json<MatchResponse>) {
    let (res_tx, res_rx) = oneshot::channel();

    {
        let mut queue = player_queue.lock().unwrap();

        if queue.iter().any(|player| player.user_id == body.user_id) {
            tracing::error!("User {} already in queue", body.user_id);
            return (
                StatusCode::BAD_REQUEST,
                Json(MatchResponse::Err("Player already in queue".to_string())),
            );
        }

        queue.push_back(MatchingPlayer {
            user_id: body.user_id.clone(),
            tx: res_tx,
        });
    }

    tracing::info!("User {} requests a match", body.user_id);

    #[allow(unused_variables)]
    let auto_drop = AutoDrop {
        user_id: body.user_id.clone(),
        queue: player_queue.clone(),
    };

    notify_tx.send(()).await.unwrap();

    let res = res_rx.await.unwrap();
    if res.is_err() {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(res))
    } else {
        (StatusCode::OK, Json(res))
    }
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    dotenv().ok();

    let (notify_tx, notify_rx) = mpsc::channel(MAX_CHANNEL_SIZE);

    let player_queue = Arc::new(Mutex::new(VecDeque::<MatchingPlayer>::new()));

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&env::var("DATABASE_URL").expect("expecting DATABASE_URL in .env"))
        .await
        .unwrap();

    let cors = CorsLayer::new()
        .allow_origin(AllowOrigin::any())
        .allow_methods([Method::POST])
        .allow_headers([
            header::CONTENT_TYPE,
            header::ACCEPT,
            header::ORIGIN,
            header::AUTHORIZATION,
        ])
        .allow_credentials(false);

    let app = Router::new()
        .route(
            "/match",
            post({
                let cloned_queue = player_queue.clone();
                move |body| post_match(notify_tx, cloned_queue, body)
            }),
        )
        .layer(cors);

    tokio::spawn(matcher(notify_rx, player_queue.clone(), pool));

    let listener = tokio::net::TcpListener::bind(HOST).await.unwrap();
    tracing::info!("Running at {HOST}");
    axum::serve(listener, app).await.unwrap();
}
