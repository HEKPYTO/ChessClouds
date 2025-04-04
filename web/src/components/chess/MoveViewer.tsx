"use client";

import { Button } from "@/components/ui/button";

export interface MovePair {
  moveNumber: number;
  whiteMove?: string;
  blackMove?: string;
  whiteIndex: number;
  blackIndex: number;
}

export interface MoveViewerProps {
  movePairs: MovePair[];
  previewIndex: number | null;
  previewMove: (index: number) => void;
  handleResetGame: () => void;
  handlePrevious: () => void;
  handleNext: () => void;
  handleForward: () => void;
  fullHistoryLength: number;
}

export function MoveViewer({
  movePairs,
  previewIndex,
  previewMove,
  handleResetGame,
  handlePrevious,
  handleNext,
  handleForward,
  fullHistoryLength,
}: MoveViewerProps) {
  return (
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
        <Button variant="outline" onClick={handleNext} disabled={previewIndex === null && fullHistoryLength === 0}>
          Next
        </Button>
        <Button variant="outline" onClick={handleForward} disabled={previewIndex === null}>
          Forward
        </Button>
      </div>
    </div>
  );
}