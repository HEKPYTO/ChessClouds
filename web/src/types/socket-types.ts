export type Color = 'Black' | 'White';
export type GameOutcome =
  | { type: 'Decisive'; winner: 'w' | 'b' }
  | { type: 'Draw' }
  | { type: 'Ongoing' };
export type ErrorType =
  | 'Deserialization'
  | 'Unauthorized'
  | 'InvalidTurn'
  | 'InvalidMove';
export type ClientMessage =
  | { kind: 'Auth'; value: { game_id: string; user_id: string } }
  | { kind: 'Move'; value: string };
export type ServerMessage =
  | { kind: 'Move'; value: string }
  | { kind: 'GameEnd'; value: GameOutcome }
  | { kind: 'Error'; value: ErrorType }
  | { kind: 'AuthSuccess' }
  | { kind: 'MoveHistory'; value: string[] };
