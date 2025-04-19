use std::{clone, sync::Arc, time::Duration};

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
use uuid::Uuid;

use crate::{
    message::{ClientMessage, Error, ServerMessage},
    state::{ActiveGame, ActiveGameMap, AppState},
    DEFERRED_CLEAN_UP_DURATION, MAX_CHANNEL_CAPACITY,
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

pub async fn ws_handler(ws: WebSocketUpgrade, State(state): State<AppState>) -> Response {
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

async fn handle_socket(socket: WebSocket, state: AppState) {
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
        .active_games
        .get(&connection.game_id)
        .expect("game should exist")
        .connect(connection.color);

    let move_history = state
        .active_games
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
        state.active_games.clone(),
        connection.clone(),
        tx_local,
    ));
    let mut write_task = tokio::spawn(handle_socket_write(writer, rx_broadcast, rx_local));

    tokio::select! {
        _ = &mut read_task => write_task.abort(),
        _ = &mut write_task => read_task.abort()
    }

    tracing::info!("socket closing {} {}", connection.game_id, connection.color);

    state
        .active_games
        .get(&connection.game_id)
        .expect("game should exist")
        .disconnect(connection.color);

    if state
        .active_games
        .read(&connection.game_id, |_, v| {
            !v.black_connected && !v.white_connected
        })
        .expect("game should exist")
    {
        // both players disconnect, initiate deferred clean up
        if state
            .active_games
            .read(&connection.game_id, |_, v| v.clean_up_task.is_none())
            .expect("game should exist")
        {
            let cloned_state = state.clone();
            let cloned_game_id = connection.game_id.clone();

            let join_handle = tokio::spawn(async move {
                tracing::info!("initiating deferred clean up for {}", cloned_game_id);

                tokio::time::sleep(Duration::from_secs(DEFERRED_CLEAN_UP_DURATION)).await;

                tracing::info!("cleaning up state for {}", cloned_game_id);

                cloned_state
                    .active_games
                    .remove(&cloned_game_id)
                    .expect("game should exist");
                if let Err(e) = sqlx::query!(
                    "DELETE FROM ActiveGames WHERE GameID = $1",
                    Uuid::parse_str(&cloned_game_id).expect("game_id should be a valid UUID")
                )
                .execute(&cloned_state.pool)
                .await
                {
                    tracing::error!("removing active game failed: {e}");
                }
            });

            state
                .active_games
                .get(&connection.game_id)
                .expect("game should exist")
                .clean_up_task = Some(join_handle);
        }
    }
}

fn get_connection_from_map(
    state: &AppState,
    game_id: &str,
    user_id: &str,
) -> Option<Result<Connection>> {
    state.active_games.read(game_id, |_, v| {
        if v.black_user_id.as_str() == user_id && !v.black_connected {
            return Ok(Connection {
                game_id: game_id.to_owned(),
                color: Color::Black,
                tx_broadcast: v.tx_broadcast.clone(),
            });
        } else if v.white_user_id.as_str() == user_id && !v.white_connected {
            return Ok(Connection {
                game_id: game_id.to_owned(),
                color: Color::White,
                tx_broadcast: v.tx_broadcast.clone(),
            });
        }
        tracing::error!("connection not found in appstate");
        Err(Error::Unauthorized)
    })
}

async fn auth_socket(socket: &mut SplitStream<WebSocket>, state: &AppState) -> Result<Connection> {
    while let Some(Ok(Message::Text(text))) = socket.next().await {
        let client_msg: ClientMessage = match serde_json::from_str(text.as_str()) {
            Ok(msg) => msg,
            Err(_) => {
                tracing::error!("auth deserialization failed");
                return Err(Error::Deserialization);
            }
        };

        if let ClientMessage::Auth { game_id, user_id } = client_msg {
            // find active game in server's HashMap first
            match get_connection_from_map(state, &game_id, &user_id) {
                Some(conn) => return conn,

                // if not found, find from DB and add to HashMap
                None => {
                    let game_uuid = match Uuid::parse_str(&game_id) {
                        Ok(uuid) => uuid,
                        Err(_) => {
                            tracing::error!("Failed to parse GameID UUID");
                            return Err(Error::Unauthorized);
                        }
                    };

                    let row = sqlx::query!(
                        "SELECT GameID, Black, White FROM ActiveGames WHERE GameId = $1",
                        game_uuid
                    )
                    .fetch_one(&state.pool)
                    .await;

                    match row {
                        Ok(row) => {
                            let _ = state
                                .active_games
                                .insert(game_id.clone(), ActiveGame::new(row.white, row.black));

                            tracing::info!("adding to app state");
                            return get_connection_from_map(state, &game_id, &user_id)
                                .expect("game should exist");
                        }
                        Err(_) => {
                            tracing::error!("auth row not found in DB");
                            return Err(Error::Unauthorized);
                        }
                    }
                }
            }
        }
    }

    tracing::error!("auth failed outside while let");
    Err(Error::Unauthorized)
}

async fn handle_socket_read(
    mut reader: SplitStream<WebSocket>,
    state: ActiveGameMap,
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
