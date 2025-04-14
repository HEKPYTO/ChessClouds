use std::sync::Arc;

use axum::{
    routing::{any, get, post},
    Router,
    http::{HeaderValue, Method, header},
};
use scc::HashMap;
use tower_http::cors::CorsLayer;
use ws_server::{
    game_state::GameStateMap,
    route::{games::get_games, init::post_init, ws::ws_handler},
    HOST,
};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let state: GameStateMap = Arc::new(HashMap::new());

    let cors = CorsLayer::new()
        .allow_origin([
            "http://localhost:3000".parse::<HeaderValue>().unwrap(),
            "http://127.0.0.1:3000".parse::<HeaderValue>().unwrap(),
        ])
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([
            header::CONTENT_TYPE,
            header::ACCEPT,
            header::ORIGIN,
            header::AUTHORIZATION,
        ])
        .allow_credentials(true);

    let app = Router::new()
        .route("/ws", any(ws_handler))
        .route("/init", post(post_init))
        .route("/games", get(get_games))
        .with_state(state)
        .layer(cors);

    let listener = tokio::net::TcpListener::bind(HOST).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}