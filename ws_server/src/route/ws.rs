use axum::{
    extract::{
        ws::{Message, Utf8Bytes, WebSocket},
        State, WebSocketUpgrade,
    },
    response::Response,
};
use shakmaty::{san::San, Color, Position};
use tokio::sync::{
    broadcast,
    mpsc::{self, Receiver, Sender},
};

use crate::{
    game_state::GameStateMap,
    message::{ClientMessage, Error, ServerMessage},
    MAX_CHANNEL_CAPACITY,
};
use futures_util::{
    sink::SinkExt,
    stream::{SplitSink, SplitStream, StreamExt},
};

type Result<T> = std::result::Result<T, Error>;

struct ConnectionInfo {
    pub game_id: String,
    pub color: Color,
    pub tx_broadcast: broadcast::Sender<ServerMessage>,
}

pub async fn ws_handler(ws: WebSocketUpgrade, State(state): State<GameStateMap>) -> Response {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}

async fn send_msg(
    writer: &mut SplitSink<WebSocket, Message>,
    msg: &ServerMessage,
) -> std::result::Result<(), axum::Error> {
    writer
        .send(Message::Text(Utf8Bytes::from(
            serde_json::to_string(&msg).unwrap(),
        )))
        .await
}

async fn handle_socket(socket: WebSocket, state: GameStateMap) {
    tracing::info!("socket connected");

    let (mut writer, mut reader) = socket.split();
    let (tx_local, rx_local) = mpsc::channel(MAX_CHANNEL_CAPACITY);

    let conn_info = match auth_socket(&mut reader, &state).await {
        Ok(info) => {
            let msg = ServerMessage::AuthSuccess;
            let _ = send_msg(&mut writer, &msg).await;
            tracing::info!("auth success: {} {}", info.game_id, info.color);
            info
        }
        Err(err) => {
            let msg = ServerMessage::Error(err);
            let _ = send_msg(&mut writer, &msg).await;
            tracing::error!("auth failed");
            return;
        }
    };

    let rx_broadcast = conn_info.tx_broadcast.subscribe();

    let read_task = tokio::spawn(handle_socket_read(
        reader,
        state.clone(),
        conn_info,
        tx_local,
    ));
    let write_task = tokio::spawn(handle_socket_write(writer, rx_broadcast, rx_local));

    let _ = tokio::join!(read_task, write_task);

    tracing::info!("socket closing");
    // TODO: clean up things
}

async fn auth_socket(
    socket: &mut SplitStream<WebSocket>,
    state: &GameStateMap,
) -> Result<ConnectionInfo> {
    while let Some(Ok(msg)) = socket.next().await {
        if let Message::Text(text) = msg {
            let client_msg: ClientMessage = match serde_json::from_str(text.as_str()) {
                Ok(msg) => msg,
                Err(_) => return Err(Error::Deserialization),
            };

            match client_msg {
                ClientMessage::Auth { game_id, user_id } => {
                    return state
                        .read(&game_id, |_, v| {
                            if v.black_user_id == user_id {
                                return Ok(ConnectionInfo {
                                    game_id: game_id.clone(),
                                    color: Color::Black,
                                    tx_broadcast: v.tx_broadcast.clone(),
                                });
                            } else if v.white_user_id == user_id {
                                return Ok(ConnectionInfo {
                                    game_id: game_id.clone(),
                                    color: Color::White,
                                    tx_broadcast: v.tx_broadcast.clone(),
                                });
                            }
                            Err(Error::Unauthorized)
                        })
                        .unwrap_or(Err(Error::Unauthorized));
                }
                _ => return Err(Error::Unauthorized),
            }
        }
    }

    Err(Error::Unauthorized)
}

async fn handle_socket_read(
    mut reader: SplitStream<WebSocket>,
    state: GameStateMap,
    connection_info: ConnectionInfo,
    #[allow(unused_variables)] tx_local: Sender<ServerMessage>,
) {
    while let Some(Ok(msg)) = reader.next().await {
        if let Message::Text(text) = msg {
            let client_msg: ClientMessage = match serde_json::from_str(&text.to_string()) {
                Ok(msg) => msg,
                Err(_) => {
                    let _ = tx_local
                        .send(ServerMessage::Error(Error::Deserialization))
                        .await;
                    tracing::error!("deserialization failed");
                    continue;
                }
            };

            match client_msg {
                ClientMessage::Move(san_str) => {
                    // check if is current player turn
                    if !state
                        .read(&connection_info.game_id, |_, v| {
                            connection_info.color == v.board.turn()
                        })
                        .expect("game should exist")
                    // game existence is validated from auth step
                    {
                        let _ = tx_local
                            .send(ServerMessage::Error(Error::InvalidTurn))
                            .await;
                        tracing::error!("invalid turn");
                        continue;
                    }

                    let san: San = match san_str.parse() {
                        Ok(san) => san,
                        Err(_) => {
                            let _ = tx_local
                                .send(ServerMessage::Error(Error::InvalidMove))
                                .await;
                            tracing::error!("invalid move");
                            continue;
                        }
                    };

                    let m = match state
                        .read(&connection_info.game_id, |_, v| san.to_move(&v.board))
                        .expect("game should exist")
                    {
                        Ok(m) => m,
                        Err(_) => {
                            let _ = tx_local
                                .send(ServerMessage::Error(Error::InvalidMove))
                                .await;
                            tracing::error!("invalid move");
                            continue;
                        }
                    };

                    state
                        .get(&connection_info.game_id)
                        .expect("game should exist")
                        .board
                        .play_unchecked(&m); // move is already validated when calling `san.to_move`

                    tracing::info!("broadcasting move {san_str}");
                    connection_info
                        .tx_broadcast
                        .send(ServerMessage::Move(san_str))
                        .unwrap();

                    let outcome = state
                        .read(&connection_info.game_id, |_, v| v.board.outcome())
                        .expect("game should exist");

                    if let Some(outcome) = outcome {
                        connection_info
                            .tx_broadcast
                            .send(ServerMessage::GameEnd(outcome))
                            .unwrap();
                        tracing::info!("game ended {} {}", connection_info.game_id, outcome);
                        break;
                    }
                }
                _ => {
                    continue;
                }
            }
        }
    }
}

async fn handle_socket_write(
    mut writer: SplitSink<WebSocket, Message>,
    mut rx_broadcast: broadcast::Receiver<ServerMessage>,
    mut rx_local: Receiver<ServerMessage>,
) {
    loop {
        tokio::select! {
            Ok(msg) = rx_broadcast.recv() => {
                if send_msg(&mut writer, &msg).await
                    .is_err()
                {
                    tracing::error!("socket send failed");
                    break;
                }
                if msg.is_game_end() {
                    break;
                }
            }
            Some(msg) = rx_local.recv() => {
                if send_msg(&mut writer, &msg).await
                    .is_err()
                {
                    tracing::error!("socket send failed");
                    break;
                }
            }
        }
    }
}
