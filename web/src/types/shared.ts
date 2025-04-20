export type Color = 'White' | 'Black';
export type ChessColor = 'w' | 'b';

export interface GameOutcome {
  Decisive?: {
    winner: Color;
  };
}

export type ErrorType =
  | 'Deserialization'
  | 'Unauthorized'
  | 'InvalidTurn'
  | 'InvalidMove'
  | 'ConnectionFailed'
  | 'ConnectionClosed'
  | 'Maximum reconnection attempts reached'
  | 'Cannot send move: connection not open'
  | 'Cannot send move: not authenticated'
  | 'Error parsing message'
  | 'Connection error'
  | 'Connection closed';

export type ClientMessage =
  | { kind: 'Auth'; value: { game_id: string; user_id: string } }
  | { kind: 'Move'; value: string };

export type ServerMessage =
  | { kind: 'Move'; value: string }
  | { kind: 'GameEnd'; value: GameOutcome | 'Draw' }
  | { kind: 'Error'; value: ErrorType | string }
  | { kind: 'AuthSuccess' }
  | { kind: 'MoveHistory'; value: string[] };

export type MoveCallback = (move: string) => void;
export type AuthCallback = () => void;
export type ErrorCallback = (error: string) => void;
export type HistoryCallback = (moves: string[]) => void;
export type GameEndCallback = (outcome: GameOutcome | 'Draw') => void;
