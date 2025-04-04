"use client";

import { useState, useMemo } from "react";
import { Chess } from "chess.js";

type PgnMoveListProps = {
  pgn: string;
};

export default function PgnMoveList({ pgn }: PgnMoveListProps) {
  // The current "move index" – how many half-moves we have played
  // 0 = initial position, 1 = after the first move, etc.
  const [moveIndex, setMoveIndex] = useState(0);

  // Parse the PGN once and store all half-moves in an array
  const moves = useMemo(() => {
    const chess = new Chess();
    chess.loadPgn(pgn);
    return chess.history({ verbose: true }); // returns an array of move objects
  }, [pgn]);

  // We group moves in pairs so that we can display them like "1. e4 e5"
  const movePairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < moves.length; i += 2) {
      const whiteMove = moves[i];
      const blackMove = moves[i + 1];
      const moveNumber = Math.floor(i / 2) + 1; // 1-based numbering
      pairs.push({
        moveNumber,
        whiteMove: whiteMove?.san,
        blackMove: blackMove?.san,
        whiteMoveIndex: i + 1, // half-move index for White
        blackMoveIndex: i + 2, // half-move index for Black
      });
    }
    return pairs;
  }, [moves]);

  // Basic navigation functions
  const nextMove = () => setMoveIndex((prev) => Math.min(prev + 1, moves.length));
  const prevMove = () => setMoveIndex((prev) => Math.max(prev - 1, 0));
  const reset = () => setMoveIndex(0);

  // Jump to a specific move (when clicking on the move in the list)
  const goToMove = (index: number) => setMoveIndex(index);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <button onClick={reset} disabled={moveIndex === 0}>
          Reset
        </button>
        <button onClick={prevMove} disabled={moveIndex === 0}>
          Prev
        </button>
        <button onClick={nextMove} disabled={moveIndex === moves.length}>
          Next
        </button>
      </div>

      {/* Move list */}
      <ol className="list-none p-0">
        {movePairs.map((pair, idx) => (
          <li key={idx} className="mb-1">
            <span className="font-bold mr-1">{pair.moveNumber}.</span>
            
            {/* White move */}
            {pair.whiteMove && (
              <button
                className="mr-2"
                onClick={() => goToMove(pair.whiteMoveIndex)}
                style={{
                  fontWeight: moveIndex === pair.whiteMoveIndex ? "bold" : "normal",
                  textDecoration: moveIndex === pair.whiteMoveIndex ? "underline" : "none",
                }}
              >
                {pair.whiteMove}
              </button>
            )}

            {/* Black move */}
            {pair.blackMove && (
              <button
                onClick={() => goToMove(pair.blackMoveIndex)}
                style={{
                  fontWeight: moveIndex === pair.blackMoveIndex ? "bold" : "normal",
                  textDecoration: moveIndex === pair.blackMoveIndex ? "underline" : "none",
                }}
              >
                {pair.blackMove}
              </button>
            )}
          </li>
        ))}
      </ol>

      {/* Display current move index for reference */}
      <div>Current move index: {moveIndex}</div>
    </div>
  );
}