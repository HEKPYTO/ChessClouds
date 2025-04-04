"use client";

import { useState, useEffect, useMemo } from "react";
import Chessground from "react-chessground";
import "react-chessground/dist/styles/chessground.css";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

type ChessBoardWithHistoryProps = { playingAs: "w" | "b" };

export default function ChessBoardWithHistory({ playingAs }: ChessBoardWithHistoryProps) {
  const [chess, setChess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [lastMove, setLastMove] = useState<[Square, Square] | undefined>();
  const [selectVisible, setSelectVisible] = useState(false);
  const [pendingMove, setPendingMove] = useState<[Square, Square] | undefined>();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const fullHistory = useMemo(() => chess.history({ verbose: true }), [fen]);
  const previewFen = useMemo(() => {
    if (previewIndex === null) return null;
    const temp = new Chess();
    fullHistory.slice(0, previewIndex).forEach(m => temp.move(m.san));
    return temp.fen();
  }, [previewIndex, fullHistory]);
  useEffect(() => { setFen(chess.fen()); }, [chess]);
  const move = () => {
    if (playingAs === "b" && chess.turn() !== "b" && !chess.isGameOver()) {
      setTimeout(randomMove, 500);
    }
  };
  useEffect(() => { move(); }, [playingAs, chess]);
  const updateState = () => { setFen(chess.fen()); };
  const onMove = (from: Square, to: Square) => {
    if (previewIndex !== null) { setPreviewIndex(null); return; }
    if (chess.turn() !== playingAs) return;
    const moves = chess.moves({ verbose: true });
    const moveFound = moves.find((m) => m.from === from && m.to === to);
    if (!moveFound) return;
    if (moveFound.promotion) { setPendingMove([from, to]); setSelectVisible(true); }
    else if (chess.move({ from, to })) { setLastMove([from, to]); updateState(); setTimeout(randomMove, 500); }
  };
  const randomMove = () => {
    const opponentColor = playingAs === "w" ? "b" : "w";
    const moves = chess.moves({ verbose: true }).filter((m: any) => m.color === opponentColor);
    if (moves.length > 0 && !chess.isGameOver()) {
      const random = moves[Math.floor(Math.random() * moves.length)];
      chess.move(random);
      setLastMove([random.from as Square, random.to as Square]);
      updateState();
    }
  };
  const promotion = (e: PromotionPiece) => {
    if (!pendingMove) return;
    const [from, to] = pendingMove;
    chess.move({ from, to, promotion: e });
    setLastMove([from, to]);
    setSelectVisible(false);
    updateState();
    setTimeout(randomMove, 500);
  };
  const previewMove = (index: number) => {
    if (index >= fullHistory.length) setPreviewIndex(null);
    else setPreviewIndex(index);
  };
  const handleResetGame = () => {
    chess.reset(); 
    setFen(chess.fen()); 
    setLastMove(undefined);
    setPreviewIndex(null);
    move();
  };
  const handlePrevious = () => { if (fullHistory.length > 0) setPreviewIndex(previewIndex === null ? fullHistory.length - 1 : Math.max(previewIndex - 1, 0)); };
  const handleNext = () => {
    if (previewIndex === null) return;
    if (previewIndex >= fullHistory.length - 1) setPreviewIndex(null);
    else setPreviewIndex(previewIndex + 1);
  };
  const handleForward = () => { setPreviewIndex(null); };
  const movePairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < fullHistory.length; i += 2) {
      const whiteMove = fullHistory[i];
      const blackMove = fullHistory[i + 1];
      pairs.push({
        moveNumber: Math.floor(i / 2) + 1,
        whiteMove: whiteMove?.san,
        blackMove: blackMove?.san,
        whiteIndex: i + 1,
        blackIndex: i + 2,
      });
    }
    return pairs;
  }, [fullHistory]);
  const boardFen = previewFen ? previewFen : fen;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Interactive Chess</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row gap-8 items-start">
        <div className={`relative ${previewIndex !== null ? "border-orange-500" : "border-transparent"} pb-8 rounded-sm border-10`}>
          <Chessground
            width="600px"
            height="600px"
            fen={boardFen}
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
          {previewIndex !== null && (
            <div className="absolute bottom-0 inset-x-0 text-center bg-orange-500 text-white py-1">
              Preview Mode
            </div>
          )}
          {selectVisible && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-md z-10">
              <div className="flex gap-4">
                {(["q", "r", "n", "b"] as PromotionPiece[]).map((piece) => (
                  <div key={piece} className="w-12 h-12 flex justify-center items-center cursor-pointer" onClick={() => promotion(piece)}>
                    <img src={pieceImages[chess.turn() as "w" | "b"][piece]} alt={`${chess.turn() === "w" ? "White" : "Black"} ${piece.toUpperCase()}`} className="w-16 h-16" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-full max-h-96 overflow-y-auto border p-4 flex flex-col">
          <ol className="list-none p-0 flex-1">
            {movePairs.map((pair, idx) => (
              <li key={idx} className="mb-1 flex gap-2 items-center">
                <span className="w-6 font-bold">{pair.moveNumber}.</span>
                {pair.whiteMove && (
                  <Button variant="ghost" className="p-1" onClick={() => previewMove(pair.whiteIndex)}>
                    {pair.whiteMove}
                  </Button>
                )}
                {pair.blackMove && (
                  <Button variant="ghost" className="p-1" onClick={() => previewMove(pair.blackIndex)}>
                    {pair.blackMove}
                  </Button>
                )}
              </li>
            ))}
          </ol>
          <div className="mt-4 flex justify-between gap-2">
            <Button variant="outline" onClick={handleResetGame}>
              Reset
            </Button>
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
            <Button variant="outline" onClick={handleNext} disabled={previewIndex === null && fullHistory.length === 0}>
              Next
            </Button>
            <Button variant="outline" onClick={handleForward} disabled={previewIndex === null}>
              Forward
            </Button>
          </div>
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