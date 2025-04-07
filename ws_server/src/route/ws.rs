use std::sync::Arc;

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

struct Connection {
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

    let connection = match auth_socket(&mut reader, &state).await {
        Ok(info) => {
            let msg = ServerMessage::AuthSuccess;
            let _ = send_msg(&mut writer, &msg).await;
            tracing::info!("auth success: {} {}", info.game_id, info.color);
            Arc::new(info)
        }
        Err(err) => {
            let msg = ServerMessage::Error(err);
            let _ = send_msg(&mut writer, &msg).await;
            tracing::error!("auth failed");
            return;
        }
    };

    state
        .get(&connection.game_id)
        .expect("game should exist")
        .connect(connection.color);

    let move_history = state
        .read(&connection.game_id, |_, v| v.moves.clone())
        .expect("game should exist");
    if send_msg(&mut writer, &ServerMessage::MoveHistory(move_history))
        .await
        .is_err()
    {
        return;
    }

    let rx_broadcast = connection.tx_broadcast.subscribe();

    let mut read_task = tokio::spawn(handle_socket_read(
        reader,
        state.clone(),
        connection.clone(),
        tx_local,
    ));
    let mut write_task = tokio::spawn(handle_socket_write(writer, rx_broadcast, rx_local));

    // let _ = write_task.await;
    // read_task.abort();
    tokio::select! {
        _ = &mut read_task => write_task.abort(),
        _ = &mut write_task => read_task.abort()
    }

    tracing::info!("socket closing {} {}", connection.game_id, connection.color);

    state
        .get(&connection.game_id)
        .expect("game should exist")
        .disconnect(connection.color);
    // TODO: clean up things
}

async fn auth_socket(
    socket: &mut SplitStream<WebSocket>,
    state: &GameStateMap,
) -> Result<Connection> {
    while let Some(Ok(Message::Text(text))) = socket.next().await {
        let client_msg: ClientMessage = match serde_json::from_str(text.as_str()) {
            Ok(msg) => msg,
            Err(_) => return Err(Error::Deserialization),
        };

        if let ClientMessage::Auth { game_id, user_id } = client_msg {
            return state
                .read(&game_id, |_, v| {
                    if v.black_user_id == user_id && !v.black_connected {
                        return Ok(Connection {
                            game_id: game_id.clone(),
                            color: Color::Black,
                            tx_broadcast: v.tx_broadcast.clone(),
                        });
                    } else if v.white_user_id == user_id && !v.white_connected {
                        return Ok(Connection {
                            game_id: game_id.clone(),
                            color: Color::White,
                            tx_broadcast: v.tx_broadcast.clone(),
                        });
                    }
                    Err(Error::Unauthorized)
                })
                .unwrap_or(Err(Error::Unauthorized));
        }
    }

    Err(Error::Unauthorized)
}

async fn handle_socket_read(
    mut reader: SplitStream<WebSocket>,
    state: GameStateMap,
    connection: Arc<Connection>,
    #[allow(unused_variables)] tx_local: Sender<ServerMessage>,
) {
    while let Some(Ok(Message::Text(text))) = reader.next().await {
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

        if let ClientMessage::Move(san_str) = client_msg {
            // check if is current player turn
            if !state
                .read(&connection.game_id, |_, v| {
                    connection.color == v.board.turn()
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
                .read(&connection.game_id, |_, v| san.to_move(&v.board))
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
                .get(&connection.game_id)
                .expect("game should exist")
                .board
                .play_unchecked(&m); // move is already validated when calling `san.to_move`

            tracing::info!("broadcasting move {san_str}");
            connection
                .tx_broadcast
                .send(ServerMessage::Move(san_str.clone()))
                .unwrap();

            state
                .get(&connection.game_id)
                .expect("game should exist")
                .moves
                .push(san_str.clone());

            let outcome = state
                .read(&connection.game_id, |_, v| v.board.outcome())
                .expect("game should exist");

            if let Some(outcome) = outcome {
                connection
                    .tx_broadcast
                    .send(ServerMessage::GameEnd(outcome))
                    .unwrap();
                tracing::info!("game ended {} {}", connection.game_id, outcome);
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
