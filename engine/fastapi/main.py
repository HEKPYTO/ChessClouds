from fastapi import FastAPI, HTTPException
import socket
import time
import re
import chess

app = FastAPI()

def connect_to_stockfish(host="stockfish", port=4001, timeout=10):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    try:
        sock.connect((host, port))
        return sock
    except Exception as e:
        raise Exception(f"Failed to connect to Stockfish: {str(e)}")

def send_command(sock, command):
    try:
        sock.sendall(f"{command}\n".encode('utf-8'))
    except Exception as e:
        raise Exception(f"Failed to send command: {str(e)}")

def receive_until(sock, marker, timeout=30):
    start_time = time.time()
    buffer = ""
    while time.time() - start_time < timeout:
        try:
            data = sock.recv(4096).decode('utf-8')
            if not data:
                time.sleep(0.1)
                continue
            buffer += data
            if marker in buffer:
                return buffer
        except socket.timeout:
            time.sleep(0.1)
    raise Exception(f"Timeout waiting for '{marker}'")

@app.get("/")
def read_root():
    return {"message": "Stockfish API is running"}

@app.get("/test")
def test_stockfish_connection():
    try:
        sock = connect_to_stockfish()
        send_command(sock, "uci")
        response = receive_until(sock, "uciok")
        sock.close()
        return {"status": "success", "message": "Connected to Stockfish successfully", "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/bestmove")
def get_best_move(fen: str):
    if not fen:
        raise HTTPException(status_code=400, detail="Missing 'fen' parameter")
    try:
        sock = connect_to_stockfish()
        send_command(sock, "uci")
        receive_until(sock, "uciok")
        send_command(sock, "isready")
        receive_until(sock, "readyok")
        send_command(sock, f"position fen {fen}")
        send_command(sock, "go depth 20")
        response = receive_until(sock, "bestmove")
        sock.close()
        match = re.search(r'bestmove\s+(\w+)', response)
        if match:
            best_move = match.group(1)
            board = chess.Board(fen)
            move = chess.Move.from_uci(best_move)
            if move in board.legal_moves:
                board.push(move)
                new_fen = board.fen()
                return {"best_move": best_move, "new_fen": new_fen}
            else:
                return {"status": "error", "message": "Best move is not legal in the given position", "best_move": best_move}
        else:
            return {"status": "error", "message": "Could not find best move in response", "raw_response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4000)