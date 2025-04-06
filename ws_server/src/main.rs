use std::sync::Arc;

use axum::{
    routing::{any, get, post},
    Router,
};
use scc::HashMap;
use ws_server::{
    game_state::GameStateMap,
    route::{games::get_games, init::post_init, ws::ws_handler},
};

#[tokio::main]
async fn main() {
    let state: GameStateMap = Arc::new(HashMap::new());

    let app = Router::new()
        .route("/ws", any(ws_handler))
        .route("/init", post(post_init))
        .route("/games", get(get_games))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
