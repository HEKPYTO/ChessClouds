// /**
//  * Game status enum representing the possible states of a game
//  */
// export type GameStatus = 'ONGOING' | 'WHITE_WINS' | 'BLACK_WINS' | 'DRAW';

// /**
//  * Represents a game history entry in the database
//  */
// export interface GameHistoryEntry {
//   gameId: string;
//   playerA: string;
//   playerB: string;
//   pgn: string;
//   createdAt: Date;
//   status: GameStatus;
// }

// /**
//  * Response from the create game API
//  */
// export interface CreateGameResponse {
//   gameId: string;
// }

// /**
//  * Response from the update game API
//  */
// export interface UpdateGameResponse {
//   success: boolean;
//   gameId: string;
// }

// /**
//  * Response from the get games API
//  */
// export interface GetGamesResponse {
//   success: boolean;
//   games: GameHistoryEntry[];
// }

// /**
//  * Error response from APIs
//  */
// export interface ErrorResponse {
//   error: string;
//   message?: string;
// }

// /**
//  * Game outcome representation for socket games
//  */
// export interface GameOutcome {
//   type: 'Decisive' | 'Draw' | 'Ongoing';
//   winner?: 'w' | 'b';
// }

// /**
//  * Convert a GameStatus to a GameOutcome
//  */
// export const gameStatusToOutcome = (status: GameStatus): GameOutcome => {
//   switch (status) {
//     case 'WHITE_WINS':
//       return { type: 'Decisive', winner: 'w' };
//     case 'BLACK_WINS':
//       return { type: 'Decisive', winner: 'b' };
//     case 'DRAW':
//       return { type: 'Draw' };
//     case 'ONGOING':
//       return { type: 'Ongoing' };
//   }
// };

// /**
//  * Convert a GameOutcome to a GameStatus
//  */
// export const gameOutcomeToStatus = (outcome: GameOutcome): GameStatus => {
//   if (outcome.type === 'Decisive') {
//     return outcome.winner === 'w' ? 'WHITE_WINS' : 'BLACK_WINS';
//   } else if (outcome.type === 'Draw') {
//     return 'DRAW';
//   } else {
//     return 'ONGOING';
//   }
// };
