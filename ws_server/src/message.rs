use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export)]
pub enum Error {
    Deserialization,
    Unauthorized,
    InvalidTurn,
    InvalidMove,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[serde(tag = "kind", content = "value")]
#[ts(export)]
pub enum ClientMessage {
    Auth { game_id: String, user_id: String },
    Move(String),
    Ping,
}

#[derive(Serialize, Deserialize, TS)]
#[serde(remote = "shakmaty::Color")]
#[ts(export)]
enum Color {
    Black = 0,
    White = 1,
}

// why shakmaty does not derive this???
#[derive(Serialize, Deserialize, TS)]
#[serde(remote = "shakmaty::Outcome")]
#[ts(export)]
enum Outcome {
    Decisive {
        #[serde(with = "Color")]
        #[ts(as = "Color")]
        winner: shakmaty::Color,
    },
    Draw,
}

#[derive(Serialize, Debug, Clone, TS)]
#[serde(tag = "kind", content = "value")]
#[ts(export)]
pub enum ServerMessage {
    Move(String),
    GameEnd(
        #[serde(with = "Outcome")]
        #[ts(as = "Outcome")]
        shakmaty::Outcome,
    ),
    Error(Error),
    AuthSuccess,
    MoveHistory(Vec<String>),
    Pong,
}

impl ServerMessage {
    pub fn is_game_end(&self) -> bool {
        match self {
            Self::GameEnd(_) => true,
            _ => false,
        }
    }
}
