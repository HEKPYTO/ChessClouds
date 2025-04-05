"use client";

import Chessground from "react-chessground";
import "react-chessground/dist/styles/chessground.css";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import Image from "next/image";

import wQ from "react-chessground/dist/images/pieces/merida/wQ.svg";
import wR from "react-chessground/dist/images/pieces/merida/wR.svg";
import wN from "react-chessground/dist/images/pieces/merida/wN.svg";
import wB from "react-chessground/dist/images/pieces/merida/wB.svg";
import bQ from "react-chessground/dist/images/pieces/merida/bQ.svg";
import bR from "react-chessground/dist/images/pieces/merida/bR.svg";
import bN from "react-chessground/dist/images/pieces/merida/bN.svg";
import bB from "react-chessground/dist/images/pieces/merida/bB.svg";

type PromotionPiece = "q" | "r" | "n" | "b";
const pieceImages: Record<"w" | "b", Record<PromotionPiece, string>> = {
  w: { q: wQ, r: wR, n: wN, b: wB },
  b: { q: bQ, r: bR, n: bN, b: bB },
};

export interface ChessBoardProps {
  fen: string;
  onMove: (from: Square, to: Square) => void;
  lastMove?: [Square, Square];
  playingAs: "w" | "b";
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
        const moves = chess.moves({ square: piece.square, verbose: true }) as { to: Square }[];
        if (moves.length) dests.set(piece.square as Square, moves.map((m) => m.to));
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
  return (
    <div
      className={`relative ${
        previewIndex !== null ? "border-orange-500" : "border-transparent"
      } rounded-sm border-10 w-full max-w-lg mx-auto`}
    >
      <div className="relative w-full aspect-square overflow-hidden">
        <Chessground
          width="100%"
          height="100%"
          fen={fen}
          onMove={onMove}
          lastMove={lastMove}
          turnColor={chess.turn() === "w" ? "white" : "black"}
          orientation={playingAs === "w" ? "white" : "black"}
          movable={{
            free: false,
            color:
              chess.turn() === playingAs ? (playingAs === "w" ? "white" : "black") : undefined,
            dests: calcMovable(chess),
          }}
        />
      </div>
      {previewIndex !== null && (
        <div className="bg-orange-500 text-white text-center pt-2">
          Preview Mode
        </div>
      )}
      {selectVisible && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-md z-10">
          <div className="flex gap-4">
            {(["q", "r", "n", "b"] as PromotionPiece[]).map((piece) => (
              <div
                key={piece}
                className="w-12 h-12 flex justify-center items-center cursor-pointer"
                onClick={() => promotion(piece)}
              >
              <Image
                src={pieceImages[chess.turn() as "w" | "b"][piece]}
                alt={`${chess.turn() === "w" ? "White" : "Black"} ${piece.toUpperCase()}`}
                width={64} 
                height={64}
              />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}