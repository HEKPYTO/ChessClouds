use std::sync::Arc;

use scc::HashMap;
use shakmaty::{Chess, Color};
use sqlx::{Pool, Postgres};
use tokio::sync::broadcast;

use crate::{message::ServerMessage, MAX_CHANNEL_CAPACITY};

pub struct ActiveGame {
    pub white_user_id: String,
    pub black_user_id: String,
    pub white_connected: bool,
    pub black_connected: bool,
    pub board: Chess,
    pub tx_broadcast: broadcast::Sender<ServerMessage>,
    pub moves: Vec<String>,
}

impl ActiveGame {
    pub fn new(white_user_id: String, black_user_id: String) -> Self {
        let (tx, _) = broadcast::channel(MAX_CHANNEL_CAPACITY);
        ActiveGame {
            white_user_id,
            black_user_id,
            white_connected: false,
            black_connected: false,
            board: Chess::default(),
            tx_broadcast: tx,
            moves: Vec::new(),
        }
    }

    pub fn connect(&mut self, color: Color) {
        match color {
            Color::Black => {
                assert!(!self.black_connected);
                self.black_connected = true;
            }
            Color::White => {
                assert!(!self.white_connected);
                self.white_connected = true;
            }
        }
    }

    pub fn disconnect(&mut self, color: Color) {
        match color {
            Color::Black => {
                assert!(self.black_connected);
                self.black_connected = false;
            }
            Color::White => {
                assert!(self.white_connected);
                self.white_connected = false;
            }
        }
    }
}

pub type ActiveGameMap = Arc<HashMap<String, ActiveGame>>;

#[derive(Clone)]
pub struct AppState {
    pub active_games: ActiveGameMap,
    pub pool: Pool<Postgres>,
}
