use axum::{extract::State, http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::game_state::{GameState, GameStateMap};

#[derive(Deserialize, Serialize, Debug, TS)]
#[ts(export)]
pub struct InitBody {
    pub game_id: String,
    pub white_user_id: String,
    pub black_user_id: String,
}

pub async fn post_init(
    State(state): State<GameStateMap>,
    Json(body): Json<InitBody>,
) -> (StatusCode, &'static str) {
    tracing::info!("/POST init");
    if state
        .insert(
            body.game_id,
            GameState::new(body.white_user_id, body.black_user_id),
        )
        .is_err()
    {
        tracing::error!("Game already exists");
        return (StatusCode::INTERNAL_SERVER_ERROR, "Game already exists");
    }
    (StatusCode::OK, "OK")
}
