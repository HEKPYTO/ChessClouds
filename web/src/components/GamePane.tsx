'use client';

import { useState, useEffect, useRef } from 'react';
import { Chess, type Move } from 'chess.js';
import type { Square } from 'chess.js';
import { Button } from '@/components/ui/button';
import { ChessBoard } from '@/components/ChessBoard';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface GameProps {
  chess: Chess;
  fen: string;
  lastMove?: [Square, Square];
  selectVisible: boolean;
  pendingMove?: [Square, Square];
  previewIndex: number | null;
  fullHistory: Move[];
  previewFen: string | null;
  onMove: (from: Square, to: Square) => void;
  promotion: (piece: 'q' | 'r' | 'n' | 'b') => void;
  previewMove: (index: number) => void;
  handleFirstMove: () => void;
  handlePrevious: () => void;
  handleNext: () => void;
  handleLastMove: () => void;
}

interface PaneProps {
  playingAs: 'w' | 'b';
  gameProps: GameProps;
}

export default function GamePane({ playingAs, gameProps }: PaneProps) {
  const {
    chess,
    fen,
    lastMove,
    selectVisible,
    previewIndex,
    fullHistory,
    previewFen,
    onMove,
    promotion,
    previewMove,
    handleFirstMove,
    handlePrevious,
    handleNext,
    handleLastMove,
  } = gameProps;

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const moveListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      moveListRef.current &&
      fullHistory.length > 0 &&
      previewIndex === null
    ) {
      moveListRef.current.scrollTop = moveListRef.current.scrollHeight;
    }
  }, [fullHistory.length, previewIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();

        setPressedKeys((prev) => {
          const updated = new Set(prev);
          updated.add(e.key);
          return updated;
        });

        if (e.key === 'ArrowLeft') {
          handlePrevious();
        } else if (e.key === 'ArrowRight') {
          handleNext();
        } else if (e.key === 'ArrowUp') {
          handleFirstMove();
        } else if (e.key === 'ArrowDown') {
          handleLastMove();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        setPressedKeys((prev) => {
          const updated = new Set(prev);
          updated.delete(e.key);
          return updated;
        });
      }
    };

    const handleBlur = () => {
      setPressedKeys(new Set());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handlePrevious, handleNext, handleFirstMove, handleLastMove]);

  const movePairs = [];
  for (let i = 0; i < fullHistory.length; i += 2) {
    const whiteMove = fullHistory[i];
    const blackMove = fullHistory[i + 1];
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      whiteMove: whiteMove?.san,
      blackMove: blackMove?.san,
      whiteIndex: i + 1,
      blackIndex: i + 2,
    });
  }

  const boardFen = previewFen ? previewFen : fen;
  const gameStatus = getGameStatus(chess);

  return (
    <Card className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md rounded-xl overflow-hidden">
      <CardContent className="p-4 md:p-6">
        <div className="md:hidden flex flex-col md:gap-6">
          <Card className="bg-white dark:bg-slate-700 border border-amber-200/50 dark:border-slate-600/50 shadow-none">
            <CardContent className="p-4 text-center">
              <div className="font-medium text-lg text-amber-800 dark:text-amber-200">
                Player A (1600) - Player B (1600)
              </div>
              <div className="text-sm text-amber-600 dark:text-amber-300">
                {gameStatus}
              </div>
            </CardContent>
          </Card>

          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-lg">
              <ChessBoard
                fen={boardFen}
                onMove={onMove}
                lastMove={lastMove}
                playingAs={playingAs}
                selectVisible={selectVisible}
                promotion={promotion}
                previewIndex={previewIndex}
                chess={chess}
              />
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 my-4">
            <Button
              variant="outline"
              size="sm"
              data-key="ArrowUp"
              className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white
            shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px]
            dark:bg-amber-500 dark:hover:bg-amber-600
            dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]
            ${
              pressedKeys.has('ArrowUp') ? 'translate-y-[2px] shadow-none' : ''
            }`}
              onClick={handleFirstMove}
              disabled={fullHistory.length === 0}
              aria-label="First move"
            >
              <ChevronDoubleLeftIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              data-key="ArrowLeft"
              className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white
            shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px]
            dark:bg-amber-500 dark:hover:bg-amber-600
            dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]
            ${
              pressedKeys.has('ArrowLeft')
                ? 'translate-y-[2px] shadow-none'
                : ''
            }`}
              onClick={handlePrevious}
              disabled={previewIndex === 0 || fullHistory.length === 0}
              aria-label="Previous move"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              data-key="ArrowRight"
              className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white
            shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px]
            dark:bg-amber-500 dark:hover:bg-amber-600
            dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]
            ${
              pressedKeys.has('ArrowRight')
                ? 'translate-y-[2px] shadow-none'
                : ''
            }`}
              onClick={handleNext}
              disabled={previewIndex === null || fullHistory.length === 0}
              aria-label="Next move"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              data-key="ArrowDown"
              className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white
            shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px]
            dark:bg-amber-500 dark:hover:bg-amber-600
            dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]
            ${
              pressedKeys.has('ArrowDown')
                ? 'translate-y-[2px] shadow-none'
                : ''
            }`}
              onClick={handleLastMove}
              disabled={previewIndex === null}
              aria-label="Last move"
            >
              <ChevronDoubleRightIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="bg-amber-50 dark:bg-slate-800 rounded-lg border border-amber-200/50 dark:border-amber-800/30 overflow-hidden shadow-md flex flex-col h-[435px]">
            <div
              ref={moveListRef}
              className="overflow-y-auto flex-grow max-h-[435px] px-4 font-mono text-sm"
            >
              <div className="pt-2" />
              <table className="w-full table-fixed">
                <thead className="text-left text-amber-700 dark:text-amber-300 border-b border-amber-200/50 dark:border-amber-700/30 sticky top-0 bg-amber-50 dark:bg-slate-800">
                  <tr>
                    <th className="w-10 py-2">#</th>
                    <th className="w-1/2 py-2">White</th>
                    <th className="w-1/2 py-2">Black</th>
                  </tr>
                </thead>
                <tbody>
                  {movePairs.length > 0 ? (
                    movePairs.map((move) => (
                      <tr
                        key={move.moveNumber}
                        className="hover:bg-amber-50 dark:hover:bg-amber-900/20"
                      >
                        <td className="py-1 text-amber-600 dark:text-amber-400">
                          {move.moveNumber}.
                        </td>
                        <td className="py-1">
                          {move.whiteMove && (
                            <button
                              className={`font-semibold text-amber-800 dark:text-amber-200 ${
                                previewIndex === move.whiteIndex
                                  ? 'bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded'
                                  : 'hover:bg-amber-100/50 dark:hover:bg-amber-900/20 px-2 py-0.5 rounded'
                              }`}
                              onClick={() => previewMove(move.whiteIndex)}
                            >
                              {move.whiteMove}
                            </button>
                          )}
                        </td>
                        <td className="py-1">
                          {move.blackMove && (
                            <button
                              className={`font-semibold text-amber-800 dark:text-amber-200 ${
                                previewIndex === move.blackIndex
                                  ? 'bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded'
                                  : 'hover:bg-amber-100/50 dark:hover:bg-amber-900/20 px-2 py-0.5 rounded'
                              }`}
                              onClick={() => previewMove(move.blackIndex)}
                            >
                              {move.blackMove}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center text-amber-500 dark:text-amber-400 py-4"
                      >
                        No moves yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="hidden md:flex md:flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 flex flex-center items-center justify-center min-h-full">
            <div className="w-full max-w-lg">
              <ChessBoard
                fen={boardFen}
                onMove={onMove}
                lastMove={lastMove}
                playingAs={playingAs}
                selectVisible={selectVisible}
                promotion={promotion}
                previewIndex={previewIndex}
                chess={chess}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <Card className="bg-white dark:bg-slate-700 border border-amber-200/50 dark:border-slate-600/50 shadow-none">
              <CardContent className="p-4 text-center">
                <div className="font-medium text-lg text-amber-800 dark:text-amber-200">
                  Player A (1600) - Player B (1600)
                </div>
                <div className="text-sm text-amber-600 dark:text-amber-300">
                  {gameStatus}
                </div>
              </CardContent>
            </Card>

            <div className="flex-1 bg-amber-50 dark:bg-slate-800 rounded-lg border border-amber-200/50 dark:border-amber-800/30 overflow-hidden shadow-md flex flex-col h-[435px]">
              <div
                ref={moveListRef}
                className="overflow-y-auto flex-grow max-h-[400px] px-4 font-mono text-sm"
              >
                <div className="pt-2" />
                <table className="w-full table-fixed">
                  <thead className="text-left text-amber-700 dark:text-amber-300 border-b border-amber-200/50 dark:border-amber-700/30 sticky top-0 bg-amber-50 dark:bg-slate-800">
                    <tr>
                      <th className="w-10 py-2">#</th>
                      <th className="w-1/2 py-2">White</th>
                      <th className="w-1/2 py-2">Black</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movePairs.length > 0 ? (
                      movePairs.map((move) => (
                        <tr
                          key={move.moveNumber}
                          className="hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        >
                          <td className="py-1 text-amber-600 dark:text-amber-400">
                            {move.moveNumber}.
                          </td>
                          <td className="py-1">
                            {move.whiteMove && (
                              <button
                                className={`font-semibold text-amber-800 dark:text-amber-200 ${
                                  previewIndex === move.whiteIndex
                                    ? 'bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded'
                                    : 'hover:bg-amber-100/50 dark:hover:bg-amber-900/20 px-2 py-0.5 rounded'
                                }`}
                                onClick={() => previewMove(move.whiteIndex)}
                              >
                                {move.whiteMove}
                              </button>
                            )}
                          </td>
                          <td className="py-1">
                            {move.blackMove && (
                              <button
                                className={`font-semibold text-amber-800 dark:text-amber-200 ${
                                  previewIndex === move.blackIndex
                                    ? 'bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded'
                                    : 'hover:bg-amber-100/50 dark:hover:bg-amber-900/20 px-2 py-0.5 rounded'
                                }`}
                                onClick={() => previewMove(move.blackIndex)}
                              >
                                {move.blackMove}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center text-amber-500 dark:text-amber-400 py-4"
                        >
                          No moves yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-amber-200/50 dark:border-amber-700/30 mt-auto px-4 py-2">
                <div className="flex justify-center items-center gap-2 my-2">
                  <Button
                    variant="outline"
                    size="sm"
                    data-key="ArrowUp"
                    className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white
                    shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px]
                    dark:bg-amber-500 dark:hover:bg-amber-600
                    dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]
                    ${
                      pressedKeys.has('ArrowUp')
                        ? 'translate-y-[2px] shadow-none'
                        : ''
                    }`}
                    onClick={handleFirstMove}
                    disabled={fullHistory.length === 0}
                    aria-label="First move"
                  >
                    <ChevronDoubleLeftIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    data-key="ArrowLeft"
                    className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white
                    shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px]
                    dark:bg-amber-500 dark:hover:bg-amber-600
                    dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]
                    ${
                      pressedKeys.has('ArrowLeft')
                        ? 'translate-y-[2px] shadow-none'
                        : ''
                    }`}
                    onClick={handlePrevious}
                    disabled={previewIndex === 0 || fullHistory.length === 0}
                    aria-label="Previous move"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    data-key="ArrowRight"
                    className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white
                    shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px]
                    dark:bg-amber-500 dark:hover:bg-amber-600
                    dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]
                    ${
                      pressedKeys.has('ArrowRight')
                        ? 'translate-y-[2px] shadow-none'
                        : ''
                    }`}
                    onClick={handleNext}
                    disabled={previewIndex === null || fullHistory.length === 0}
                    aria-label="Next move"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    data-key="ArrowDown"
                    className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white
                    shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px]
                    dark:bg-amber-500 dark:hover:bg-amber-600
                    dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]
                    ${
                      pressedKeys.has('ArrowDown')
                        ? 'translate-y-[2px] shadow-none'
                        : ''
                    }`}
                    onClick={handleLastMove}
                    disabled={previewIndex === null}
                    aria-label="Last move"
                  >
                    <ChevronDoubleRightIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getGameStatus(chess: Chess): string {
  if (!chess.isGameOver()) return 'On Going';
  if (chess.isCheckmate()) {
    const winner = chess.turn() === 'w' ? 'Black' : 'White';
    return `Completed - ${winner} wins by checkmate`;
  }
  if (chess.isStalemate()) return 'Completed - Stalemate';
  if (chess.isDraw()) return 'Completed - Draw';
  return 'Completed';
}
