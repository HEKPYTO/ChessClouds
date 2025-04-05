use dashmap::DashMap;
use serde::{Deserialize, Serialize};
use shakmaty::Chess;
use tokio::sync::broadcast;

use crate::{message::ServerMessage, MAX_CHANNEL_CAPACITY};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Color {
    White,
    Black,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum GameOutcome {
    Win(Color),
    Draw,
}

pub struct GameState {
    pub white_user_id: String,
    pub black_user_id: String,
    pub board: Chess,
    pub current_turn: Color,
    pub sender: broadcast::Sender<ServerMessage>,
    pub receiver: broadcast::Receiver<ServerMessage>,
}

impl GameState {
    pub fn new(white_user_id: String, black_user_id: String) -> Self {
        let (sender, receiver) = broadcast::channel(MAX_CHANNEL_CAPACITY);
        GameState {
            white_user_id,
            black_user_id,
            board: Chess::default(),
            current_turn: Color::White,
            sender,
            receiver,
        }
    }
}

pub type GameStateMap = DashMap<String, GameState>;
