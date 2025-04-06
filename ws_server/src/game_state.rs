use std::sync::Arc;

use scc::HashMap;
use shakmaty::Chess;
use tokio::sync::broadcast;

use crate::{message::ServerMessage, MAX_CHANNEL_CAPACITY};

pub struct GameState {
    pub white_user_id: String,
    pub black_user_id: String,
    pub board: Chess,
    pub tx_broadcast: broadcast::Sender<ServerMessage>,
}

impl GameState {
    pub fn new(white_user_id: String, black_user_id: String) -> Self {
        let (tx, _) = broadcast::channel(MAX_CHANNEL_CAPACITY);
        GameState {
            white_user_id,
            black_user_id,
            board: Chess::default(),
            tx_broadcast: tx,
        }
    }
}

pub type GameStateMap = Arc<HashMap<String, GameState>>;
