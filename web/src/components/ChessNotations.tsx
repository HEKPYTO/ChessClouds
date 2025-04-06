// components/ChessNotations.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chess } from 'chess.js';

interface ChessNotationsProps {
  pgn: string;
}

interface MoveDisplay {
  number: number;
  white: {
    piece: 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
    move: string;
  } | null;
  black: {
    piece: 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
    move: string;
  } | null;
}

export default function ChessNotations({ pgn }: ChessNotationsProps) {
  const [moves, setMoves] = useState<MoveDisplay[]>([]);

  useEffect(() => {
    if (!pgn) return;

    try {
      const chess = new Chess();
      chess.loadPgn(pgn);
      const history = chess.history({ verbose: true });
      const formattedMoves: MoveDisplay[] = [];

      for (let i = 0; i < history.length; i += 2) {
        const moveNumber = Math.floor(i / 2) + 1;
        const whiteMove = history[i];
        const blackMove = i + 1 < history.length ? history[i + 1] : null;

        const getPieceType = (
          piece: string
        ): 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king' => {
          switch (piece.toLowerCase()) {
            case 'p':
              return 'pawn';
            case 'n':
              return 'knight';
            case 'b':
              return 'bishop';
            case 'r':
              return 'rook';
            case 'q':
              return 'queen';
            case 'k':
              return 'king';
            default:
              return 'pawn';
          }
        };

        formattedMoves.push({
          number: moveNumber,
          white: whiteMove
            ? {
                piece: getPieceType(whiteMove.piece),
                move: whiteMove.san,
              }
            : null,
          black: blackMove
            ? {
                piece: getPieceType(blackMove.piece),
                move: blackMove.san,
              }
            : null,
        });
      }

      setMoves(formattedMoves);
    } catch (error) {
      console.error('Error parsing PGN:', error);
    }
  }, [pgn]);

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <Card className="p-4 h-full flex flex-col bg-amber-50 border-amber-200 overflow-hidden shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-amber-900">Game Notation</h3>
      </div>

      <div className="overflow-y-auto flex-grow mb-2 font-mono text-sm">
        <table className="w-full table-fixed">
          <thead className="text-left text-amber-700 border-b border-amber-200/50">
            <tr>
              <th className="w-10">#</th>
              <th className="w-1/2">White</th>
              <th className="w-1/2">Black</th>
            </tr>
          </thead>
          <tbody>
            {moves.map((move) => (
              <tr key={move.number} className="hover:bg-amber-100/50">
                <td className="py-1 text-amber-600">{move.number}.</td>
                <td className="py-1">
                  {move.white && (
                    <div className="flex items-center">
                      <span className="font-semibold">{move.white.move}</span>
                    </div>
                  )}
                </td>
                <td className="py-1">
                  {move.black && (
                    <div className="flex items-center">
                      <span className="font-semibold">{move.black.move}</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-2 border-t border-amber-200/50">
        <Button
          variant="outline"
          className="w-full border-amber-300 text-amber-800 hover:bg-amber-100/70"
          onClick={handleRestart}
        >
          Restart Game
        </Button>
      </div>
    </Card>
  );
}
