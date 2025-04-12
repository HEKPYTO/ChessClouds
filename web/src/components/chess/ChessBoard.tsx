'use client';

import Chessground from 'react-chessground';
import 'react-chessground/dist/styles/chessground.css';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import wQ from 'react-chessground/dist/images/pieces/merida/wQ.svg';
import wR from 'react-chessground/dist/images/pieces/merida/wR.svg';
import wN from 'react-chessground/dist/images/pieces/merida/wN.svg';
import wB from 'react-chessground/dist/images/pieces/merida/wB.svg';
import bQ from 'react-chessground/dist/images/pieces/merida/bQ.svg';
import bR from 'react-chessground/dist/images/pieces/merida/bR.svg';
import bN from 'react-chessground/dist/images/pieces/merida/bN.svg';
import bB from 'react-chessground/dist/images/pieces/merida/bB.svg';

type PromotionPiece = 'q' | 'r' | 'n' | 'b';
const pieceImages: Record<'w' | 'b', Record<PromotionPiece, string>> = {
  w: { q: wQ, r: wR, n: wN, b: wB },
  b: { q: bQ, r: bR, n: bN, b: bB },
};

export interface ChessBoardProps {
  fen: string;
  onMove: (from: Square, to: Square) => void;
  lastMove?: [Square, Square];
  playingAs: 'w' | 'b';
  selectVisible: boolean;
  promotion: (piece: PromotionPiece) => void;
  previewIndex: number | null;
  chess: Chess;
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

export function ChessBoard({
  fen,
  onMove,
  lastMove,
  playingAs,
  selectVisible,
  promotion,
  previewIndex,
  chess,
}: ChessBoardProps) {
  const handleMove = (from: Square, to: Square) => {
    if (previewIndex !== null) return;
    onMove(from, to);
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-transparent border-0 shadow-none">
      <CardContent
        className={`p-0 ${
          previewIndex !== null
            ? 'bg-amber-500 dark:bg-amber-500 rounded-sm'
            : ''
        }`}
      >
        <div className="w-full">
          <div className="w-full aspect-square relative">
            <Chessground
              width="100%"
              height="100%"
              fen={fen}
              onMove={handleMove}
              lastMove={lastMove}
              turnColor={chess.turn() === 'w' ? 'white' : 'black'}
              orientation={playingAs === 'w' ? 'white' : 'black'}
              movable={{
                free: false,
                color:
                  previewIndex !== null
                    ? undefined
                    : chess.turn() === playingAs
                    ? playingAs === 'w'
                      ? 'white'
                      : 'black'
                    : undefined,
                dests: previewIndex !== null ? new Map() : calcMovable(chess),
              }}
              coordinates={true}
              animation={{ enabled: true, duration: 100 }}
              highlight={{
                lastMove: true,
                check: true,
              }}
              viewOnly={previewIndex !== null}
            />

            {selectVisible && !previewIndex && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-700 p-4 rounded shadow-md dark:shadow-black/20 z-10">
                <div className="flex gap-4">
                  {(['q', 'r', 'n', 'b'] as PromotionPiece[]).map((piece) => (
                    <Button
                      key={piece}
                      variant="outline"
                      className="w-12 h-12 p-0 flex justify-center items-center bg-amber-50 dark:bg-slate-600 hover:bg-amber-100 dark:hover:bg-slate-500 transition-colors border-amber-200 dark:border-slate-500"
                      onClick={() => promotion(piece)}
                    >
                      <Image
                        src={pieceImages[chess.turn() as 'w' | 'b'][piece]}
                        alt={`${
                          chess.turn() === 'w' ? 'White' : 'Black'
                        } ${piece.toUpperCase()}`}
                        width={64}
                        height={64}
                      />
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {previewIndex !== null ? (
            <div className="bg-amber-500 text-white text-center py-3 font-medium">
              Preview Mode
            </div>
          ) : (
            <div className="bg-transparent py-6 font-medium"></div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
