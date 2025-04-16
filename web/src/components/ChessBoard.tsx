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
  promotion: (piece: 'q' | 'r' | 'n' | 'b') => void;
  previewIndex: number | null;
  chess: Chess;
  viewOnly?: boolean;
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
  viewOnly = false,
}: ChessBoardProps) {
  const handleMove = (from: Square, to: Square) => {
    if (previewIndex !== null || viewOnly) return;
    onMove(from, to);
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-transparent border-0 shadow-none pt-4 pb-0 md:py-6">
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
                  previewIndex !== null || viewOnly
                    ? undefined
                    : chess.turn() === playingAs
                    ? playingAs === 'w'
                      ? 'white'
                      : 'black'
                    : undefined,
                dests:
                  previewIndex !== null || viewOnly
                    ? new Map()
                    : calcMovable(chess),
              }}
              coordinates={true}
              animation={{ enabled: true, duration: 100 }}
              highlight={{
                lastMove: true,
                check: true,
              }}
              viewOnly={previewIndex !== null || viewOnly}
            />

            {selectVisible && !previewIndex && !viewOnly && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 p-4 rounded-lg shadow-md dark:shadow-black/20 z-10">
                <div className="flex gap-4">
                  {(['q', 'r', 'n', 'b'] as const).map((piece) => (
                    <Button
                      key={piece}
                      variant="outline"
                      className="w-12 h-12 p-0 flex justify-center items-center 
                      border-amber-300 text-amber-800 hover:bg-amber-50/80 
                      shadow-[0_4px_0_0_#fcd34d] hover:shadow-[0_2px_0_0_#fcd34d] hover:translate-y-[2px]
                      dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
                      dark:shadow-[0_4px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]
                      backdrop-blur-sm"
                      onClick={() => promotion(piece)}
                    >
                      <Image
                        src={pieceImages[chess.turn() as 'w' | 'b'][piece]}
                        alt={`${
                          chess.turn() === 'w' ? 'White' : 'Black'
                        } ${piece.toUpperCase()}`}
                        width={40}
                        height={40}
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
          ) : viewOnly ? (
            <div className="bg-amber-600 text-white text-center py-3 font-medium">
              Game Ended
            </div>
          ) : (
            <div className="bg-transparent py-6 font-medium"></div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
