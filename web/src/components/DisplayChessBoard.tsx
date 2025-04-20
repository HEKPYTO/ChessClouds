'use client';

import Chessground from 'react-chessground';
import 'react-chessground/dist/styles/chessground.css';
import { Chess, type Move } from 'chess.js';
import type { Square } from 'chess.js';
import { useState, useEffect, useRef } from 'react';

export interface CustomChessBoardProps {
  className?: string;
  initialFen?: string;
  pgn?: string;
}

export function calcMovable(chess: Chess) {
  const dests = new Map<Square, Square[]>();
  for (const row of chess.board()) {
    for (const piece of row) {
      if (piece && piece.square) {
        const moves = chess.moves({ square: piece.square, verbose: true }) as {
          to: Square;
        }[];
        if (moves.length)
          dests.set(
            piece.square as Square,
            moves.map((m) => m.to)
          );
      }
    }
  }
  return dests;
}

export default function CustomChessBoard({
  className = '',
  initialFen,
  pgn,
}: CustomChessBoardProps) {
  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState<string>('');
  const [lastMove, setLastMove] = useState<[Square, Square] | undefined>();
  const moveIndex = useRef(0);
  const moves = useRef<Move[]>([]);

  useEffect(() => {
    chess.reset();

    if (initialFen) {
      try {
        chess.load(initialFen);
      } catch (e) {
        console.error('Invalid FEN:', e);
      }
    }

    if (pgn) {
      try {
        chess.loadPgn(pgn);
        moves.current = chess.history({ verbose: true });
        chess.reset();
        if (initialFen) {
          chess.load(initialFen);
        }
      } catch (e) {
        console.error('Invalid PGN:', e);
      }
    }

    setFen(chess.fen());

    if (pgn && moves.current.length > 0) {
      moveIndex.current = 0;
      const intervalId = setInterval(() => {
        if (moveIndex.current < moves.current.length) {
          const move = moves.current[moveIndex.current];
          chess.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion,
          });
          setLastMove([move.from as Square, move.to as Square]);
          setFen(chess.fen());
          moveIndex.current++;
        } else {
          clearInterval(intervalId);
        }
      }, 1200);

      return () => clearInterval(intervalId);
    }
  }, [chess, initialFen, pgn]);

  const onMove = (from: Square, to: Square) => {
    try {
      const move = chess.move({ from, to });
      if (move) {
        setLastMove([from, to]);
        setFen(chess.fen());
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
  };

  if (!fen)
    return (
      <div
        className={`${className} w-full aspect-square bg-amber-100 dark:bg-slate-700`}
      ></div>
    );

  return (
    <div
      className={`chess-board-container ${className} dark:ring-1 dark:ring-amber-700/30`}
    >
      <div className="relative w-full aspect-square pointer-events-none">
        <Chessground
          width="100%"
          height="100%"
          fen={fen}
          onMove={onMove}
          lastMove={lastMove}
          turnColor={chess.turn() === 'w' ? 'white' : 'black'}
          movable={{
            free: false,
            color: 'both',
            dests: calcMovable(chess),
          }}
          animation={{ enabled: true, duration: 300 }}
          coordinates={true}
          highlight={{
            lastMove: true,
            check: true,
          }}
          className="dark:bg-slate-800"
        />
      </div>
    </div>
  );
}

export function LatestChessBoard({
  className = '',
  initialFen,
  pgn,
  color = 'w',
}: CustomChessBoardProps & { color?: 'w' | 'b' }) {
  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState<string>('');
  const [lastMove, setLastMove] = useState<[Square, Square] | undefined>();

  useEffect(() => {
    chess.reset();

    if (initialFen) {
      try {
        chess.load(initialFen);
      } catch (e) {
        console.error('Invalid FEN:', e);
      }
    }

    if (pgn && pgn.trim() !== '') {
      try {
        chess.loadPgn(pgn);
        const history = chess.history({ verbose: true });
        if (history.length > 0) {
          const lastMoveData = history[history.length - 1];
          setLastMove([lastMoveData.from as Square, lastMoveData.to as Square]);
        }
      } catch (e) {
        console.error('Invalid PGN:', e);
      }
    }

    setFen(chess.fen());
  }, [chess, initialFen, pgn]);

  const onMove = (from: Square, to: Square) => {
    try {
      const move = chess.move({ from, to });
      if (move) {
        setLastMove([from, to]);
        setFen(chess.fen());
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
  };

  if (!fen)
    return (
      <div
        className={`${className} w-full aspect-square bg-amber-100 dark:bg-slate-700`}
      ></div>
    );

  return (
    <div
      className={`chess-board-container ${className} dark:ring-1 dark:ring-amber-700/30`}
    >
      <div className="relative w-full aspect-square pointer-events-none">
        <Chessground
          width="100%"
          height="100%"
          fen={fen}
          onMove={onMove}
          lastMove={lastMove}
          turnColor={chess.turn() === 'w' ? 'white' : 'black'}
          orientation={color === 'w' ? 'white' : 'black'}
          movable={{
            free: false,
            color: 'both',
            dests: calcMovable(chess),
          }}
          animation={{ enabled: false }}
          coordinates={true}
          highlight={{
            lastMove: true,
            check: true,
          }}
          className="dark:bg-slate-800"
        />
      </div>
    </div>
  );
}
