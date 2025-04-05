use std::sync::Arc;

use axum::{
    extract::{
        ws::{Message, Utf8Bytes, WebSocket},
        State, WebSocketUpgrade,
    },
    http::StatusCode,
    response::Response,
    Json,
};
use serde::Deserialize;
use tokio::sync::broadcast;

use crate::{
    game_state::{Color, GameState, GameStateMap},
    message::{ClientMessage, ServerMessage},
};
use futures_util::{
    sink::SinkExt,
    stream::{SplitSink, SplitStream, StreamExt},
};

#[derive(Deserialize, Debug)]
pub struct InitBody {
    pub game_id: String,
    pub white_user_id: String,
    pub black_user_id: String,
}

pub async fn post_init(
    State(state): State<Arc<GameStateMap>>,
    Json(body): Json<InitBody>,
) -> (StatusCode, &'static str) {
    state.insert(
        body.game_id,
        GameState::new(body.white_user_id, body.black_user_id),
    );
    (StatusCode::OK, "OK")
}

struct ConnectionInfo {
    pub game_id: String,
    pub user_id: String,
    pub color: Color,
    pub sender: broadcast::Sender<ServerMessage>,
}

pub async fn ws_handler(ws: WebSocketUpgrade, State(state): State<Arc<GameStateMap>>) -> Response {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}

async fn handle_socket(mut socket: WebSocket, state: Arc<GameStateMap>) {
    let conn_info = match auth_socket(&mut socket, &state).await {
        Some(info) => info,
        None => {
            return;
        }
    };

    let (writer, reader) = socket.split();
    let rx_channel = conn_info.sender.subscribe();

    tokio::spawn(handle_socket_read(reader, state.clone(), conn_info.sender));
    tokio::spawn(handle_socket_write(writer, rx_channel));
}

async fn auth_socket(socket: &mut WebSocket, state: &Arc<GameStateMap>) -> Option<ConnectionInfo> {
    while let Some(Ok(msg)) = socket.recv().await {
        match msg {
            Message::Close(_) => return None,
            Message::Text(text) => {
                let client_msg: ClientMessage = match serde_json::from_str(text.as_str()) {
                    Ok(msg) => msg,
                    Err(_) => return None,
                };
                match client_msg {
                    ClientMessage::Auth { game_id, user_id } => {
                        if let Some(state) = state.get(&game_id) {
                            if user_id == state.white_user_id {
                                return Some(ConnectionInfo {
                                    game_id,
                                    user_id,
                                    color: Color::White,
                                    sender: state.sender.clone(),
                                });
                            } else if user_id == state.black_user_id {
                                return Some(ConnectionInfo {
                                    game_id,
                                    user_id,
                                    color: Color::Black,
                                    sender: state.sender.clone(),
                                });
                            } else {
                                return None;
                            }
                        }
                    }
                    _ => return None,
                }
            }
            _ => continue,
        }
    }

    None
}

async fn handle_socket_read(
    mut reader: SplitStream<WebSocket>,
    state: Arc<GameStateMap>,
    mut tx: broadcast::Sender<ServerMessage>,
) {
    while let Some(Ok(msg)) = reader.next().await {
        match msg {
            Message::Close(_) => break,
            Message::Text(text) => {
                text.to_string();
            }
            _ => continue,
        }
    }
}

async fn handle_socket_write(
    mut writer: SplitSink<WebSocket, Message>,
    mut rx: broadcast::Receiver<ServerMessage>,
) {
    while let Ok(msg) = rx.recv().await {
        let msg = serde_json::to_string(&msg).expect("serialization failed");
        writer
            .send(Message::Text(Utf8Bytes::from(&msg)))
            .await
            .expect("sender.send failed");
    }
}
