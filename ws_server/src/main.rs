use std::{env, sync::Arc};
use axum::{
    http::{header, Method},
    routing::{any, get, post},
    Router,
};
use dotenvy::dotenv;
use scc::HashMap;
use sqlx::postgres::PgPoolOptions;
use tower_http::cors::{CorsLayer, AllowOrigin};
use ws_server::{
    route::{games::get_games, init::post_init, ws::ws_handler},
    state::AppState,
    HOST, MAX_DB_CONNECTIONS,
};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    dotenv().ok();
    
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
        
    let pool = PgPoolOptions::new()
        .max_connections(MAX_DB_CONNECTIONS)
        .connect(&env::var("DATABASE_URL").expect("expecting DATABASE_URL in .env"))
        .await
        .unwrap();
        
    let state = AppState {
        active_games: Arc::new(HashMap::default()),
        pool,
    };
    
    let app = Router::new()
        .route("/ws", any(ws_handler))
        .route("/init", post(post_init))
        .route("/games", get(get_games))
        .with_state(state)
        .layer(cors);
        
    let listener = tokio::net::TcpListener::bind(HOST).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}