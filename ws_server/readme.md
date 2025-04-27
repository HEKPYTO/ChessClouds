# ChessClouds WebSocket Server

The WebSocket Server is the real-time communication backbone of ChessClouds, handling game sessions and move synchronization between players.

## Features

- **Real-time bidirectional communication** - Instant move updates to both players
- **Game state management** - Track game progress and handle state transitions
- **Reconnection support** - Players can reconnect to ongoing games
- **Move validation** - Ensures all moves are legal according to chess rules
- **Game outcome determination** - Detects checkmates, stalemates, and other game endings
- **Game persistence** - Stores game data in PostgreSQL database

## Architecture

The WebSocket server is built in Rust using:

- **Axum** - Web framework for handling WebSocket connections
- **Tokio** - Asynchronous runtime
- **SQLx** - Database connectivity
- **Shakmaty** - Chess rule implementation and move validation
- **SCC** - Concurrent data structures for game state management

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
3. **Game State** - Server responds with move history for the game
4. **Gameplay** - Clients exchange moves through the server
5. **Game End** - Server detects end of game and broadcasts result
6. **Disconnection** - Server handles graceful disconnections and reconnections

## Setup and Development

### Prerequisites

- Rust 1.65+
- PostgreSQL database

### Local Development

1. Navigate to the ws_server directory
```bash
cd ws_server
```

2. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database connection string
```

3. Run database migrations
```bash
cargo sqlx migrate run
```

4. Run the server
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
# Run a test game with two players
cargo run --bin client

# Test client disconnection handling
cargo run --bin client_disconnect

# Run test suite
cargo run --bin test
```