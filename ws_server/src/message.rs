use crate::game_state::GameOutcome;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Error {
    FailedAuth,
    InvalidMove,
    NotYourTurn,
}

#[derive(Deserialize, Debug)]
pub enum ClientMessage {
    Auth { game_id: String, user_id: String },
    Move(String),
}

#[derive(Serialize, Debug, Clone)]
pub enum ServerMessage {
    Move(String),
    GameEnd(GameOutcome),
    Error(Error),
}
