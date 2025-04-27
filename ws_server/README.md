# ChessClouds WebSocket Server

The WebSocket Server provides real-time communication for ChessClouds, handling game sessions and move synchronization between players.

## Features

- Real-time bidirectional communication
- Game state management
- Reconnection support
- Move validation
- Game outcome determination
- Game persistence

## Architecture

The WebSocket server is built in Rust using:

- **Axum** web framework
- **Tokio** asynchronous runtime
- **SQLx**
- **Shakmaty** for Chess rule implementation and move validation
- **SCC** for concurrent HashMap

## Protocol

The WebSocket server uses a message-based protocol for communication:

### Client Messages

```typescript
type ClientMessage =
  | { kind: "Auth"; value: { game_id: string; user_id: string } }
  | { kind: "Move"; value: string }
  | { kind: "Ping" };
```

### Server Messages

```typescript
type ServerMessage =
  | { kind: "Move"; value: string }
  | { kind: "GameEnd"; value: Outcome }
  | { kind: "Error"; value: Error }
  | { kind: "AuthSuccess" }
  | { kind: "MoveHistory"; value: Array<string> }
  | { kind: "Pong" };
```

## Flow

1. **Connection** - Client connects to WebSocket endpoint
2. **Authentication** - Client sends Auth message with game_id and user_id
3. **Game State** - Server responds with move history for the game (for reconnection)
4. **Gameplay** - Clients exchange moves through the server
5. **Game End** - Server detects end of game and broadcasts result
6. **Disconnection** - Server handles graceful disconnections and reconnections

## Setup and Development

### Prerequisites

- Rust
- PostgreSQL database

### Local Development

1. Create an `.env` file with a `DATABASE_URL` variable.

2. Run the server

```bash
cargo run
```

### Docker Deployment

```bash
docker build -t chessclouds-ws-server .
docker run -p 8000:8000 -e DATABASE_URL=postgres://user:password@host/db chessclouds-ws-server
```

## Database Schema

The server interacts with the `gamestate` table:

```sql
CREATE TABLE gamestate (
  gameid UUID PRIMARY KEY,
  white TEXT NOT NULL,
  black TEXT NOT NULL,
  pgn TEXT NOT NULL,
  createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status "GameStatus" NOT NULL DEFAULT 'On Going'
);
```

## Testing

The project includes test clients for simulating various game scenarios:

```bash
# Run a test game ending in checkmate with two players
cargo run --bin client

# Test client disconnection handling
cargo run --bin client_disconnect

# Run test suite
cargo run --bin test
```

