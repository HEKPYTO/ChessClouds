use hyper::{Body, Request, Response, Server, Method, StatusCode, header::HeaderValue};
use hyper::service::{make_service_fn, service_fn};
use regex::Regex;
use serde::Serialize;
use shakmaty::{fen::Fen, Chess, FromSetup, Position};
use std::{
    convert::Infallible,
    io::{Read, Write},
    net::TcpStream,
    time::{Duration, Instant},
};
use url::form_urlencoded;

#[derive(Serialize)]
struct MessageResponse {
    message: String,
}

#[derive(Serialize)]
struct TestResponse {
    status: String,
    message: String,
    response: String,
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

#[tokio::main]
async fn main() {
    let addr = ([0, 0, 0, 0], 4000).into();
    println!("Starting server on http://{}", addr);
    let make_svc = make_service_fn(|_conn| async { Ok::<_, Infallible>(service_fn(handle_request)) });
    let server = Server::bind(&addr).serve(make_svc);
    if let Err(e) = server.await {
        eprintln!("Server error: {}", e);
    }
}

async fn handle_request(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    if req.method() == Method::OPTIONS {
        return Ok(cors_preflight());
    }
    let response = match (req.method(), req.uri().path()) {
        (&Method::GET, "/") => {
            let body = serde_json::to_string(&MessageResponse { message: "Stockfish API is running".into() }).unwrap();
            json_response(StatusCode::OK, body)
        }
        (&Method::GET, "/test") => {
            match connect_to_stockfish() {
                Ok(mut sock) => {
                    if let Err(e) = send_command(&mut sock, "uci") {
                        return Ok(add_cors_headers(internal_error(&e.to_string())));
                    }
                    match receive_until(&mut sock, "uciok", Duration::from_secs(30)) {
                        Ok(resp) => {
                            let body = serde_json::to_string(&TestResponse {
                                status: "success".into(),
                                message: "Connected to Stockfish successfully".into(),
                                response: resp,
                            }).unwrap();
                            json_response(StatusCode::OK, body)
                        }
                        Err(e) => add_cors_headers(internal_error(&e)),
                    }
                }
                Err(e) => add_cors_headers(internal_error(&format!("Failed to connect to Stockfish: {}", e))),
            }
        }
        (&Method::GET, "/bestmove") => {
            let query = req.uri().query().unwrap_or("");
            let fen = form_urlencoded::parse(query.as_bytes())
                .find(|(k, _)| k == "fen")
                .map(|(_, v)| v.to_string())
                .unwrap_or_default();
            if fen.is_empty() {
                return Ok(add_cors_headers(bad_request("Missing 'fen' parameter")));
            }
            match get_best_move_logic(&fen) {
                Ok(resp) => {
                    let body = serde_json::to_string(&resp).unwrap();
                    json_response(StatusCode::OK, body)
                }
                Err(err_resp) => {
                    let body = serde_json::to_string(&err_resp).unwrap();
                    json_response(StatusCode::OK, body)
                }
            }
        }
        _ => Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body(Body::from("Not Found"))
            .unwrap(),
    };
    Ok(add_cors_headers(response))
}

fn cors_preflight() -> Response<Body> {
    Response::builder()
        .status(StatusCode::NO_CONTENT)
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        .header("Access-Control-Allow-Headers", "content-type")
        .body(Body::empty())
        .unwrap()
}

fn add_cors_headers(mut res: Response<Body>) -> Response<Body> {
    res.headers_mut().insert("Access-Control-Allow-Origin", HeaderValue::from_static("*"));
    res.headers_mut().insert("Access-Control-Allow-Methods", HeaderValue::from_static("GET, POST, OPTIONS"));
    res.headers_mut().insert("Access-Control-Allow-Headers", HeaderValue::from_static("content-type"));
    res
}

fn json_response(status: StatusCode, body: String) -> Response<Body> {
    Response::builder()
        .status(status)
        .header("Content-Type", "application/json")
        .body(Body::from(body))
        .unwrap()
}

fn internal_error(msg: &str) -> Response<Body> {
    Response::builder()
        .status(StatusCode::INTERNAL_SERVER_ERROR)
        .body(Body::from(msg.to_string()))
        .unwrap()
}

fn bad_request(msg: &str) -> Response<Body> {
    Response::builder()
        .status(StatusCode::BAD_REQUEST)
        .body(Body::from(msg.to_string()))
        .unwrap()
}

fn get_best_move_logic(fen: &str) -> Result<BestMoveResponse, ErrorResponse> {
    let mut sock = connect_to_stockfish().map_err(|e| ErrorResponse { status: "error".into(), message: e.to_string(), best_move: None, raw_response: None })?;
    send_command(&mut sock, "uci").map_err(|e| err_resp(&e.to_string()))?;
    receive_until(&mut sock, "uciok", Duration::from_secs(30)).map_err(|e| err_resp(&e))?;
    send_command(&mut sock, "isready").map_err(|e| err_resp(&e.to_string()))?;
    receive_until(&mut sock, "readyok", Duration::from_secs(30)).map_err(|e| err_resp(&e))?;
    send_command(&mut sock, &format!("position fen {}", fen)).map_err(|e| err_resp(&e.to_string()))?;
    send_command(&mut sock, "go depth 25").map_err(|e| err_resp(&e.to_string()))?;
    let response = receive_until(&mut sock, "bestmove", Duration::from_secs(30)).map_err(|e| err_resp(&e))?;
    let re = Regex::new(r"bestmove\s+(\w+)").unwrap();
    if let Some(caps) = re.captures(&response) {
        let best_move = caps.get(1).unwrap().as_str();
        let fen_parsed = Fen::from_ascii(fen.as_bytes()).map_err(|e| err_resp(&format!("Invalid FEN: {}", e)))?;
        let mut pos = Chess::from_setup(fen_parsed.into_setup(), shakmaty::CastlingMode::Standard).map_err(|e| err_resp(&format!("Invalid position: {}", e)))?;
        let src = &best_move[0..2];
        let dst = &best_move[2..4];
        if let (Ok(src_sq), Ok(dst_sq)) = (src.parse(), dst.parse()) {
            if let Some(mv) = pos.legal_moves().into_iter().find(|m| m.from() == Some(src_sq) && m.to() == dst_sq) {
                pos.play_unchecked(&mv);
                let new_fen = Fen::from_setup(pos.into_setup(shakmaty::EnPassantMode::Legal)).to_string();
                return Ok(BestMoveResponse { best_move: best_move.to_string(), new_fen });
            } else {
                return Err(ErrorResponse { status: "error".into(), message: "Best move is not legal".into(), best_move: Some(best_move.into()), raw_response: None });
            }
        } else {
            return Err(err_resp("Could not parse move coordinates"));
        }
    }
    Err(ErrorResponse { status: "error".into(), message: "Could not find best move in response".into(), best_move: None, raw_response: Some(response) })
}

fn err_resp(msg: &str) -> ErrorResponse {
    ErrorResponse { status: "error".into(), message: msg.to_string(), best_move: None, raw_response: None }
}

fn connect_to_stockfish() -> Result<TcpStream, std::io::Error> {
    let stream = TcpStream::connect("127.0.0.1:4001")?;
    stream.set_read_timeout(Some(Duration::from_secs(10)))?;
    stream.set_write_timeout(Some(Duration::from_secs(10)))?;
    Ok(stream)
}

fn send_command(stream: &mut TcpStream, command: &str) -> Result<(), std::io::Error> {
    stream.write_all(format!("{}\n", command).as_bytes())?;
    Ok(())
}

fn receive_until(stream: &mut TcpStream, marker: &str, timeout: Duration) -> Result<String, String> {
    let start = Instant::now();
    let mut buffer = String::new();
    while start.elapsed() < timeout {
        let mut chunk = [0; 4096];
        match stream.read(&mut chunk) {
            Ok(n) if n > 0 => {
                buffer.push_str(&String::from_utf8_lossy(&chunk[..n]));
                if buffer.contains(marker) {
                    return Ok(buffer);
                }
            }
            Ok(_) => std::thread::sleep(Duration::from_millis(100)),
            Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock || e.kind() == std::io::ErrorKind::TimedOut => std::thread::sleep(Duration::from_millis(100)),
            Err(e) => return Err(format!("Failed to read from socket: {}", e)),
        }
    }
    Err(format!("Timeout waiting for '{}'", marker))
}