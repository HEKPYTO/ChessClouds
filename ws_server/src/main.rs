use std::sync::Arc;

use axum::{
    routing::{any, get, post},
    Router,
    http::{Method, header},
};
use scc::HashMap;
use tower_http::cors::{CorsLayer, AllowOrigin};
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
        .allow_origin(AllowOrigin::any())
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([
            header::CONTENT_TYPE,
            header::ACCEPT,
            header::ORIGIN,
            header::AUTHORIZATION,
        ])
        .allow_credentials(false);

    let app = Router::new()
        .route("/ws", any(ws_handler))
        .route("/init", post(post_init))
        .route("/games", get(get_games))
        .with_state(state)
        .layer(cors);

    let listener = tokio::net::TcpListener::bind(HOST).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}