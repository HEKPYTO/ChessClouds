"use client";

import { useState, useEffect } from "react";
import Chessground from "react-chessground";
import "react-chessground/dist/styles/chessground.css";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import wQ from 'react-chessground/dist/images/pieces/merida/wQ.svg';
import wR from 'react-chessground/dist/images/pieces/merida/wR.svg';
import wN from 'react-chessground/dist/images/pieces/merida/wN.svg';
import wB from 'react-chessground/dist/images/pieces/merida/wB.svg';
import bQ from 'react-chessground/dist/images/pieces/merida/bQ.svg';
import bR from 'react-chessground/dist/images/pieces/merida/bR.svg';
import bN from 'react-chessground/dist/images/pieces/merida/bN.svg';
import bB from 'react-chessground/dist/images/pieces/merida/bB.svg';

type PromotionPiece = "q" | "r" | "n" | "b";

const pieceImages: Record<"w" | "b", Record<PromotionPiece, string>> = {
  w: { q: wQ, r: wR, n: wN, b: wB },
  b: { q: bQ, r: bR, n: bN, b: bB }
};

type ChessBoardProps = {
  playingAs: "w" | "b";
};

export default function ChessBoard({ playingAs }: ChessBoardProps) {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [lastMove, setLastMove] = useState<[Square, Square] | undefined>();
  const [selectVisible, setSelectVisible] = useState(false);
  const [pendingMove, setPendingMove] = useState<[Square, Square] | undefined>();

  useEffect(() => {
    if (playingAs === "b" && chess.turn() !== "b" && !chess.isGameOver()) {
      setTimeout(randomMove, 500);
    }
  }, [playingAs, chess]);

  const onMove = (from: Square, to: Square) => {
    if (chess.turn() !== playingAs) return;

    const moves = chess.moves({ verbose: true });
    const move = moves.find((m) => m.from === from && m.to === to);

    if (move && move.promotion) {
      setPendingMove([from, to]);
      setSelectVisible(true);
    } else {
      if (chess.move({ from, to })) {
        setFen(chess.fen());
        setLastMove([from, to]);
        setTimeout(randomMove, 500);
      }
    }
  };

  const randomMove = () => {
    const opponentColor = playingAs === "w" ? "b" : "w";
    const moves = chess.moves({ verbose: true }).filter(
      (m: any) => m.color === opponentColor
    );
    if (moves.length > 0 && !chess.isGameOver()) {
      const move = moves[Math.floor(Math.random() * moves.length)];
      chess.move(move);
      setFen(chess.fen());
      setLastMove([move.from as Square, move.to as Square]);
    }
  };

  const promotion = (e: PromotionPiece) => {
    if (!pendingMove) return;
    const [from, to] = pendingMove;
    chess.move({ from, to, promotion: e });
    setFen(chess.fen());
    setLastMove([from, to]);
    setSelectVisible(false);
    setTimeout(randomMove, 500);
  };

  const reset = () => {
    chess.reset();
    setFen(chess.fen());
    setLastMove(undefined);
  };

  const undo = () => {
    chess.undo();
    if (chess.history().length > 0) {
      chess.undo();
    }
    setFen(chess.fen());
    setLastMove(undefined);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Interactive Chess Board</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative mb-4">
          <Chessground
            width="400px"
            height="400px"
            fen={fen}
            onMove={onMove}
            lastMove={lastMove}
            turnColor={chess.turn() === "w" ? "white" : "black"}
            orientation={playingAs === "w" ? "white" : "black"}
            movable={{
              free: false,
              color: chess.turn() === playingAs ? (playingAs === "w" ? "white" : "black") : undefined,
              dests: calcMovable(chess),
            }}
          />
          
          {selectVisible && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-md z-10">
              <div className="flex gap-4">
                {(["q", "r", "n", "b"] as PromotionPiece[]).map((piece) => (
                  <div
                    key={piece}
                    className="w-12 h-12 flex justify-center items-center cursor-pointer"
                    onClick={() => promotion(piece)}
                  >
                    <img
                      src={pieceImages[chess.turn() as "w" | "b"][piece]}
                      alt={`${chess.turn() === "w" ? "White" : "Black"} ${piece.toUpperCase()}`}
                      className="w-8 h-8"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
          <Button variant="outline" onClick={undo} disabled={chess.history().length === 0}>
            Undo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function calcMovable(chess: Chess) {
  const dests = new Map<Square, Square[]>();
  for (const row of chess.board()) {
    for (const piece of row) {
      if (piece) {
        const moves = chess.moves({ square: piece.square, verbose: true }) as { to: Square }[];
        if (moves.length) dests.set(piece.square as Square, moves.map((m) => m.to));
      }
    }
  }
  return dests;
}