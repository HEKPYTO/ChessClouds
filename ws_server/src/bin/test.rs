use std::time::Duration;

use axum::body::Bytes;
use futures_util::{
    stream::{SplitSink, SplitStream},
    SinkExt, StreamExt,
};
use tokio::{net::TcpStream, time::sleep};
use tokio_tungstenite::{
    connect_async,
    tungstenite::{Message, Utf8Bytes},
    MaybeTlsStream, WebSocketStream,
};
use ws_server::{message::ClientMessage, route::init::InitBody, HOST};

const GAME_ID: &'static str = "game";
const WHITE_ID: &'static str = "white";
const BLACK_ID: &'static str = "black";

async fn send_msg(
    writer: &mut SplitSink<WebSocketStream<MaybeTlsStream<TcpStream>>, Message>,
    msg: &ClientMessage,
) -> anyhow::Result<()> {
    let msg = serde_json::to_string(&msg)?;
    writer.send(Message::Text(Utf8Bytes::from(&msg))).await?;
    sleep(Duration::from_millis(500)).await;
    Ok(())
}

fn spawn_reader(mut reader: SplitStream<WebSocketStream<MaybeTlsStream<TcpStream>>>) {
    tokio::spawn(async move {
        while let Some(Ok(msg)) = reader.next().await {
            if let Message::Text(text) = msg {
                println!("Received: {}", text.to_string());
            }
        }
    });
}

async fn test_auth(url: &str) -> anyhow::Result<()> {
    {
        // should fail
        let (socket, _) = connect_async(url).await?;
        let (mut writer, reader) = socket.split();

        spawn_reader(reader);

        send_msg(
            &mut writer,
            &ClientMessage::Auth {
                game_id: "abc".to_string(),
                user_id: WHITE_ID.to_string(),
            },
        )
        .await?;
    }
    {
        // should fail
        let (socket, _) = connect_async(url).await?;
        let (mut writer, reader) = socket.split();

        spawn_reader(reader);

        send_msg(
            &mut writer,
            &ClientMessage::Auth {
                game_id: GAME_ID.to_string(),
                user_id: "brown".to_string(),
            },
        )
        .await?;
    }
    {
        // should fail
        let (socket, _) = connect_async(url).await?;
        let (mut writer, reader) = socket.split();

        spawn_reader(reader);

        writer
            .send(Message::Ping(Bytes::from_static(b"abc")))
            .await?;
        writer
            .send(Message::Text(Utf8Bytes::from_static("abc")))
            .await?;
        send_msg(
            &mut writer,
            &ClientMessage::Auth {
                game_id: GAME_ID.to_string(),
                user_id: "brown".to_string(),
            },
        )
        .await?;
    }
    {
        // should fail
        let (socket, _) = connect_async(url).await?;
        let (mut writer, reader) = socket.split();

        spawn_reader(reader);

        send_msg(&mut writer, &ClientMessage::Move("e4".to_string())).await?;
    }

    Ok(())
}

async fn test_moves(url: &str) -> anyhow::Result<()> {
    {
        let (socket_white, _) = connect_async(url).await?;
        let (mut writer_white, reader_white) = socket_white.split();

        let (socket_black, _) = connect_async(url).await?;
        let (mut writer_black, reader_black) = socket_black.split();

        spawn_reader(reader_white);
        spawn_reader(reader_black);

        send_msg(
            &mut writer_white,
            &ClientMessage::Auth {
                game_id: GAME_ID.to_string(),
                user_id: WHITE_ID.to_string(),
            },
        )
        .await?;
        send_msg(
            &mut writer_black,
            &ClientMessage::Auth {
                game_id: GAME_ID.to_string(),
                user_id: BLACK_ID.to_string(),
            },
        )
        .await?;

        // should fail: deserialization
        writer_black
            .send(Message::Text(Utf8Bytes::from_static("abc")))
            .await?;
        // should fail: invalid turn
        send_msg(&mut writer_black, &ClientMessage::Move("e5".to_string())).await?;
        // should fail: invalid move
        send_msg(&mut writer_white, &ClientMessage::Move("abc".to_string())).await?;
        // should fail: invalid move
        send_msg(&mut writer_white, &ClientMessage::Move("e5".to_string())).await?;
        // should succeed
        send_msg(&mut writer_white, &ClientMessage::Move("e4".to_string())).await?;
        // should fail: invalid turn
        send_msg(&mut writer_white, &ClientMessage::Move("d4".to_string())).await?;
    }

    Ok(())
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let url = format!("ws://{HOST}/ws",);

    // initialize new game
    let init_body = InitBody {
        game_id: GAME_ID.to_string(),
        white_user_id: WHITE_ID.to_string(),
        black_user_id: BLACK_ID.to_string(),
    };

    let client = reqwest::Client::new();
    client
        .post(format!("http://{HOST}/init"))
        .json(&init_body)
        .send()
        .await?;

    test_auth(&url).await?;

    test_moves(&url).await?;

    Ok(())
}
