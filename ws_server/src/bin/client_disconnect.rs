use std::time::Duration;

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

async fn send_msg(
    writer: &mut SplitSink<WebSocketStream<MaybeTlsStream<TcpStream>>, Message>,
    msg: &ClientMessage,
) -> anyhow::Result<()> {
    let msg = serde_json::to_string(&msg)?;
    writer.send(Message::Text(Utf8Bytes::from(&msg))).await?;
    sleep(Duration::from_millis(500)).await;
    Ok(())
}

async fn handle_read(
    mut reader: SplitStream<WebSocketStream<MaybeTlsStream<TcpStream>>>,
    socket_name: &str,
) {
    while let Some(Ok(msg)) = reader.next().await {
        if let Message::Text(text) = msg {
            println!("{socket_name} received: {}", text.to_string());
        }
    }
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let url = format!("ws://{HOST}/ws",);

    const GAME_ID: &'static str = "123";
    const WHITE_ID: &'static str = "white";
    const BLACK_ID: &'static str = "black";

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

    let (socket1, _) = connect_async(&url).await?;
    let (mut writer1, reader1) = socket1.split();

    let (socket2, _) = connect_async(&url).await?;
    let (mut writer2, reader2) = socket2.split();

    tokio::spawn(handle_read(reader1, "socket 1"));
    let handle2 = tokio::spawn(handle_read(reader2, "socket 2"));

    send_msg(
        &mut writer1,
        &ClientMessage::Auth {
            game_id: GAME_ID.to_string(),
            user_id: WHITE_ID.to_string(),
        },
    )
    .await?;
    send_msg(
        &mut writer2,
        &ClientMessage::Auth {
            game_id: GAME_ID.to_string(),
            user_id: BLACK_ID.to_string(),
        },
    )
    .await?;

    send_msg(&mut writer1, &ClientMessage::Move("e4".to_string())).await?;
    send_msg(&mut writer2, &ClientMessage::Move("e5".to_string())).await?;

    send_msg(&mut writer1, &ClientMessage::Move("Qh5".to_string())).await?;
    send_msg(&mut writer2, &ClientMessage::Move("Nc6".to_string())).await?;

    // disconnect socket 1
    writer1.close().await?;

    let (socket3, _) = connect_async(&url).await?;
    let (mut writer3, reader3) = socket3.split();

    let handle3 = tokio::spawn(handle_read(reader3, "socket 3"));

    send_msg(
        &mut writer3,
        &ClientMessage::Auth {
            game_id: GAME_ID.to_string(),
            user_id: WHITE_ID.to_string(),
        },
    )
    .await?;

    send_msg(&mut writer3, &ClientMessage::Move("Bc4".to_string())).await?;
    send_msg(&mut writer2, &ClientMessage::Move("Nf6".to_string())).await?;

    send_msg(&mut writer3, &ClientMessage::Move("Qxf7#".to_string())).await?;

    let _ = tokio::join!(handle2, handle3);
    Ok(())
}
