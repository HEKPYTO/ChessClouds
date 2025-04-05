use std::sync::Arc;

use axum::{
    routing::{any, post},
    Router,
};
use ws_server::{
    game_state::GameStateMap,
    handler::{post_init, ws_handler},
};

#[tokio::main]
async fn main() {
    let state = Arc::new(GameStateMap::new());

    let app = Router::new()
        .route("/ws", any(ws_handler))
        .route("/init", post(post_init))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .expect("TcpListener::bind failed");
    axum::serve(listener, app)
        .await
        .expect("axum::serve failed");
}
