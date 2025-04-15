use axum::{
    extract::Query,
    routing::get,
    http::StatusCode,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::io::{Read, Write};
use std::net::TcpStream;
use std::time::{Duration, Instant};
use regex::Regex;
use shakmaty::{fen::Fen, Chess, FromSetup, Position}; 

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(root))
        .route("/test", get(test_stockfish_connection))
        .route("/bestmove", get(get_best_move));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:4000").await.unwrap();
    println!("Listening on: {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

#[derive(Serialize)]
struct MessageResponse {
    message: String,
}

async fn root() -> Json<MessageResponse> {
    Json(MessageResponse {
        message: "Stockfish API is running".to_string(),
    })
}

#[derive(Serialize)]
struct TestResponse {
    status: String,
    message: String,
    response: String,
}

async fn test_stockfish_connection() -> Result<Json<TestResponse>, (StatusCode, String)> {
    match connect_to_stockfish() {
        Ok(mut sock) => {
            if let Err(e) = send_command(&mut sock, "uci") {
                return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string()));
            }
            
            match receive_until(&mut sock, "uciok", Duration::from_secs(30)) {
                Ok(response) => {
                    Ok(Json(TestResponse {
                        status: "success".to_string(),
                        message: "Connected to Stockfish successfully".to_string(),
                        response,
                    }))
                },
                Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
            }
        },
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to connect to Stockfish: {}", e))),
    }
}

#[derive(Deserialize)]
struct BestMoveQuery {
    fen: String,
}

#[derive(Serialize)]
struct BestMoveResponse {
    best_move: String,
    new_fen: String,
}

#[derive(Serialize)]
struct ErrorResponse {
    status: String,
    message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    best_move: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    raw_response: Option<String>,
}

async fn get_best_move(Query(params): Query<BestMoveQuery>) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    if params.fen.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "Missing 'fen' parameter".to_string()));
    }

    match connect_to_stockfish() {
        Ok(mut sock) => {
            if let Err(e) = send_command(&mut sock, "uci") {
                return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string()));
            }
            
            if let Err(e) = receive_until(&mut sock, "uciok", Duration::from_secs(30)) {
                return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string()));
            }
            
            if let Err(e) = send_command(&mut sock, "isready") {
                return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string()));
            }
            
            if let Err(e) = receive_until(&mut sock, "readyok", Duration::from_secs(30)) {
                return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string()));
            }
            
            let position_cmd = format!("position fen {}", params.fen);
            if let Err(e) = send_command(&mut sock, &position_cmd) {
                return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string()));
            }
            
            if let Err(e) = send_command(&mut sock, "go depth 25") {
                return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string()));
            }
            
            match receive_until(&mut sock, "bestmove", Duration::from_secs(30)) {
                Ok(response) => {
                    let re = Regex::new(r"bestmove\s+(\w+)").unwrap();
                    if let Some(caps) = re.captures(&response) {
                        let best_move = caps.get(1).unwrap().as_str();
                        
                        match Fen::from_ascii(params.fen.as_bytes()) {
                            Ok(fen) => {
                                match Chess::from_setup(fen.into_setup(), shakmaty::CastlingMode::Standard) {
                                    Ok(mut pos) => {
                                        
                                        let m_src = best_move.get(0..2).unwrap_or("");
                                        let m_dst = best_move.get(2..4).unwrap_or("");
                                                        
                                        if let (Ok(src), Ok(dst)) = (m_src.parse(), m_dst.parse()) {
                                            let legal_moves = pos.legal_moves();
                                            let mv = legal_moves.iter().find(|m| 
                                                m.from() == Some(src) && m.to() == dst
                                            );
                                            
                                            if let Some(mv) = mv {
                                                pos.play_unchecked(mv);
                                                
                                                let new_fen = Fen::from_setup(pos.into_setup(shakmaty::EnPassantMode::Legal)).to_string();
                                                
                                                let response = BestMoveResponse {
                                                    best_move: best_move.to_string(),
                                                    new_fen,
                                                };
                                                Ok(Json(serde_json::to_value(response).unwrap()))
                                            } else {
                                                let error = ErrorResponse {
                                                    status: "error".to_string(),
                                                    message: "Best move is not legal in the given position".to_string(),
                                                    best_move: Some(best_move.to_string()),
                                                    raw_response: None,
                                                };
                                                Ok(Json(serde_json::to_value(error).unwrap()))
                                            }
                                        } else {
                                            let error = ErrorResponse {
                                                status: "error".to_string(),
                                                message: "Could not parse move coordinates".to_string(),
                                                best_move: Some(best_move.to_string()),
                                                raw_response: None,
                                            };
                                            Ok(Json(serde_json::to_value(error).unwrap()))
                                        }
                                    },
                                    Err(e) => {
                                        let error = ErrorResponse {
                                            status: "error".to_string(),
                                            message: format!("Could not create position from FEN: {}", e),
                                            best_move: Some(best_move.to_string()),
                                            raw_response: None,
                                        };
                                        Ok(Json(serde_json::to_value(error).unwrap()))
                                    }
                                }
                            },
                            Err(e) => {
                                let error = ErrorResponse {
                                    status: "error".to_string(),
                                    message: format!("Invalid FEN format: {}", e),
                                    best_move: Some(best_move.to_string()),
                                    raw_response: None,
                                };
                                Ok(Json(serde_json::to_value(error).unwrap()))
                            }
                        }
                    } else {
                        let error = ErrorResponse {
                            status: "error".to_string(),
                            message: "Could not find best move in response".to_string(),
                            best_move: None,
                            raw_response: Some(response),
                        };
                        Ok(Json(serde_json::to_value(error).unwrap()))
                    }
                },
                Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, format!("Error: {}", e))),
            }
        },
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, format!("Error: {}", e))),
    }
}

fn connect_to_stockfish() -> Result<TcpStream, std::io::Error> {
    let host = "stockfish";
    let port = 4001;
    let addr = format!("{}:{}", host, port);
    let stream = TcpStream::connect(&addr)?;
    stream.set_read_timeout(Some(Duration::from_secs(10)))?;
    stream.set_write_timeout(Some(Duration::from_secs(10)))?;
    Ok(stream)
}

fn send_command(stream: &mut TcpStream, command: &str) -> Result<(), std::io::Error> {
    let command = format!("{}\n", command);
    stream.write_all(command.as_bytes())?;
    Ok(())
}

fn receive_until(stream: &mut TcpStream, marker: &str, timeout: Duration) -> Result<String, String> {
    let start = Instant::now();
    let mut buffer = String::new();
    
    while start.elapsed() < timeout {
        let mut chunk = [0; 4096];
        match stream.read(&mut chunk) {
            Ok(n) if n > 0 => {
                let data = String::from_utf8_lossy(&chunk[0..n]).to_string();
                buffer.push_str(&data);
                if buffer.contains(marker) {
                    return Ok(buffer);
                }
            },
            Ok(_) => {
                std::thread::sleep(Duration::from_millis(100));
            },
            Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock || e.kind() == std::io::ErrorKind::TimedOut => {
                std::thread::sleep(Duration::from_millis(100));
            },
            Err(e) => return Err(format!("Failed to read from socket: {}", e)),
        }
    }
    
    Err(format!("Timeout waiting for '{}'", marker))
}