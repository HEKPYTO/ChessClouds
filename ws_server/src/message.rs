use serde::{Deserialize, Serialize};
use shakmaty::{Color, Outcome};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Error {
    Deserialization,
    Unauthorized,
    InvalidTurn,
    InvalidMove,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum ClientMessage {
    Auth { game_id: String, user_id: String },
    Move(String),
}

#[derive(Serialize, Deserialize)]
#[serde(remote = "Color")]
enum ColorDef {
    Black = 0,
    White = 1,
}

// why shakmaty does not derive this???
#[derive(Serialize, Deserialize)]
#[serde(remote = "Outcome")]
enum OutcomeDef {
    Decisive {
        #[serde(with = "ColorDef")]
        winner: Color,
    },
    Draw,
}

#[derive(Serialize, Debug, Clone)]
pub enum ServerMessage {
    Move(String),
    GameEnd(#[serde(with = "OutcomeDef")] Outcome),
    Error(Error),
    AuthSuccess,
    MoveHistory(Vec<String>),
}

impl ServerMessage {
    pub fn is_game_end(&self) -> bool {
        match self {
            Self::GameEnd(_) => true,
            _ => false,
        }
    }
}
