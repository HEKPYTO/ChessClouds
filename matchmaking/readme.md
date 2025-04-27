# ChessClouds Matchmaking Service

The Matchmaking Service is responsible for pairing players for chess games on the ChessClouds platform. It maintains a queue of players looking for games and efficiently matches them based on availability.

## Features

- **Player Queuing** - Manages a queue of players waiting for matches
- **Fast Pairing** - Quickly connects available players
- **Game Creation** - Initializes new games in the database
- **Color Assignment** - Assigns white and black pieces to players
- **Error Handling** - Graceful handling of disconnections and timeouts
- **Persistence** - Creates game records in the shared database

## Architecture

The Matchmaking Service is built in Rust using:

- **Axum** - Web framework for handling HTTP requests
- **Tokio** - Asynchronous runtime
- **SQLx** - Database connectivity
- **UUID** - Generating unique game identifiers

## API Endpoints

### POST /match

Requests a match for a player.

**Request:**
```json
{
  "user_id": "player123"
}
```

**Response (Success):**
```json
{
  "result": "Ok", 
  "value": {
    "game_id": "f8c3de3d-1f38-4c22-b0a3-43e4a3e6a87e",
    "color": "White"
  }
}
```

**Response (Error):**
```json
{
  "result": "Err",
  "value": "Player already in queue"
}
```

## Implementation Details

The service operates using the following components:

1. **Matching Queue** - A thread-safe queue that holds players waiting for matches
2. **Matcher Process** - Background task that periodically checks the queue to pair players
3. **Database Integration** - Creates game records when matches are made
4. **Auto-Cleanup** - Automatically removes players from the queue when connections close

## Flow

1. Player makes a request to `/match` with their user ID
2. Player is added to the matching queue
3. Matcher process finds another player in the queue
4. New game is created in the database with both players
5. Each player receives their game assignment and color
6. Players connect to the WebSocket server to begin the game

## Setup and Development

### Prerequisites

- Rust 1.65+
- PostgreSQL database

### Local Development

1. Navigate to the matchmaking directory
```bash
cd matchmaking
```

2. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database connection string
```

3. Run the service
```bash
cargo run
```

### Docker Deployment

```bash
docker build -t chessclouds-matchmaking .
docker run -p 8001:8001 -e DATABASE_URL=postgres://user:password@host/db chessclouds-matchmaking
```

## TypeScript Bindings

The service generates TypeScript type definitions for frontend integration:

```typescript
// MatchRequest.ts
export type MatchRequest = { user_id: string };

// MatchResponse.ts
export type MatchResponse = 
  | { result: "Ok", value: { game_id: string, color: Color } }
  | { result: "Err", value: string };

// Color.ts
export type Color = "White" | "Black";
```

These type definitions ensure type safety between the frontend and matchmaking service.