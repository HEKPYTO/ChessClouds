export interface EngineMessageResponse {
  message: string;
}

export interface EngineTestResponse {
  status: string;
  message: string;
  response: string;
}

export interface BestMoveResponse {
  best_move: string;
  new_fen: string;
}

export type EngineType =
  | EngineMessageResponse
  | EngineTestResponse
  | BestMoveResponse;
