'use client';

import { useState, useMemo, useEffect } from 'react';
import { Chess, type Move } from 'chess.js';
import type { Square } from 'chess.js';
import { Button } from '@/components/ui/button';
import { ChessBoard } from '@/components/chess/ChessBoard';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

export default function Game() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Pane playingAs="w" />
    </div>
  );
}

interface PaneProps {
  playingAs: 'w' | 'b';
}

function Pane({ playingAs }: PaneProps) {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [lastMove, setLastMove] = useState<[Square, Square] | undefined>();
  const [selectVisible, setSelectVisible] = useState(false);
  const [pendingMove, setPendingMove] = useState<[Square, Square] | undefined>();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const fullHistory = useMemo(() => chess.history({ verbose: true }), [fen]);

  const previewFen = useMemo(() => {
    if (previewIndex === null) return null;
    const temp = new Chess();
    fullHistory.slice(0, previewIndex).forEach((m) => temp.move(m.san));
    return temp.fen();
  }, [previewIndex, fullHistory]);

  useEffect(() => {
    setFen(chess.fen());
  }, [chess]);

  const onMove = (from: Square, to: Square) => {
    if (previewIndex !== null) {
      setPreviewIndex(null);
      return;
    }
    if (chess.turn() !== playingAs) return;
    const moves = chess.moves({ verbose: true });
    const moveFound = moves.find((m) => m.from === from && m.to === to);
    if (!moveFound) return;
    if (moveFound.promotion) {
      setPendingMove([from, to]);
      setSelectVisible(true);
    } else if (chess.move({ from, to })) {
      setLastMove([from, to]);
      updateState();
      setTimeout(randomMove, 500);
    }
  };

  const updateState = () => {
    setFen(chess.fen());
  };

  const randomMove = () => {
    const opponentColor = playingAs === 'w' ? 'b' : 'w';
    const moves = chess
      .moves({ verbose: true })
      .filter((m: Move) => m.color === opponentColor);
    if (moves.length > 0 && !chess.isGameOver()) {
      const random = moves[Math.floor(Math.random() * moves.length)];
      chess.move(random);
      setLastMove([random.from as Square, random.to as Square]);
      updateState();
    }
  };

  const promotion = (piece: 'q' | 'r' | 'n' | 'b') => {
    if (!pendingMove) return;
    const [from, to] = pendingMove;
    chess.move({ from, to, promotion: piece });
    setLastMove([from, to]);
    setSelectVisible(false);
    updateState();
    setTimeout(randomMove, 500);
  };

  const previewMove = (index: number) => {
    if (index >= fullHistory.length) setPreviewIndex(null);
    else setPreviewIndex(index);
  };

  const handleFirstMove = () => {
    if (fullHistory.length > 0) {
      setPreviewIndex(0);
    }
  };

  const handlePrevious = () => {
    if (previewIndex === null && fullHistory.length > 0) {
      setPreviewIndex(fullHistory.length - 1);
    } else if (previewIndex !== null && previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
    }
  };

  const handleNext = () => {
    if (previewIndex !== null && previewIndex < fullHistory.length - 1) {
      setPreviewIndex(previewIndex + 1);
    } else if (previewIndex !== null && previewIndex === fullHistory.length - 1) {
      setPreviewIndex(null);
    }
  };

  const handleLastMove = () => {
    setPreviewIndex(null);
  };

  const handleResetGame = () => {
    chess.reset();
    setFen(chess.fen());
    setLastMove(undefined);
    setPreviewIndex(null);
    if (playingAs === 'b' && chess.turn() !== 'b' && !chess.isGameOver()) {
      setTimeout(randomMove, 500);
    }
  };

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
  const gameStatus = getGameStatus(chess);

  return (
    <div className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md rounded-xl overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="mt-2 flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
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
          
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-700 rounded-lg border border-amber-200/50 dark:border-slate-600/50 p-4 text-center">
              <div className="font-medium text-lg text-amber-800 dark:text-amber-200">
                Player A (1600) - Player B (1600)
              </div>
              <div className="text-sm text-amber-600 dark:text-amber-300">
                {gameStatus}
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-700 rounded-lg border border-amber-200/50 dark:border-slate-600/50 p-4 flex flex-col h-[435px]">
              <div className="flex justify-center gap-4 mb-4">
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 p-2 bg-amber-600 hover:bg-amber-700 border-none text-white transition-all 
                  shadow-[0_4px_0_0_#b45309] hover:shadow-[0_2px_0_0_#92400e] hover:translate-y-[1px] hover:text-white
                  dark:bg-amber-500 dark:hover:bg-amber-600
                  dark:shadow-[0_4px_0_0_#92400e] dark:hover:shadow-[0_2px_0_0_#78350f]"
                  onClick={handleFirstMove}
                  disabled={fullHistory.length === 0}
                  aria-label="First move"
                >
                  <ChevronDoubleLeftIcon className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 p-2 bg-amber-600 hover:bg-amber-700 border-none text-white transition-all 
                  shadow-[0_4px_0_0_#b45309] hover:shadow-[0_2px_0_0_#92400e] hover:translate-y-[1px] hover:text-white
                  dark:bg-amber-500 dark:hover:bg-amber-600
                  dark:shadow-[0_4px_0_0_#92400e] dark:hover:shadow-[0_2px_0_0_#78350f]"
                  onClick={handlePrevious}
                  disabled={previewIndex === 0 || fullHistory.length === 0}
                  aria-label="Previous move"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 p-2 bg-amber-600 hover:bg-amber-700 border-none text-white transition-all 
                  shadow-[0_4px_0_0_#b45309] hover:shadow-[0_2px_0_0_#92400e] hover:translate-y-[1px] hover:text-white
                  dark:bg-amber-500 dark:hover:bg-amber-600
                  dark:shadow-[0_4px_0_0_#92400e] dark:hover:shadow-[0_2px_0_0_#78350f]"
                  onClick={handleNext}
                  disabled={previewIndex === null || fullHistory.length === 0}
                  aria-label="Next move"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 p-2 bg-amber-600 hover:bg-amber-700 border-none text-white transition-all 
                  shadow-[0_4px_0_0_#b45309] hover:shadow-[0_2px_0_0_#92400e] hover:translate-y-[1px] hover:text-white
                  dark:bg-amber-500 dark:hover:bg-amber-600
                  dark:shadow-[0_4px_0_0_#92400e] dark:hover:shadow-[0_2px_0_0_#78350f]"
                  onClick={handleLastMove}
                  disabled={previewIndex === null}
                  aria-label="Last move"
                >
                  <ChevronDoubleRightIcon className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-100 dark:scrollbar-thumb-slate-500 dark:scrollbar-track-slate-700">
                {movePairs.length > 0 ? (
                  <div className="pl-2">
                    {movePairs.map((pair, idx) => (
                      <div key={idx} className="flex items-center mb-2">
                        <span className="w-8 text-amber-800 dark:text-amber-200 font-medium">
                          {pair.moveNumber}.
                        </span>
                        
                        {pair.whiteMove && (
                          <button
                            className={`px-2 py-1 rounded mr-2 text-amber-800 dark:text-amber-200 font-mono
                            ${previewIndex === pair.whiteIndex 
                              ? 'bg-amber-100 dark:bg-amber-900/30' 
                              : 'hover:bg-amber-100/50 dark:hover:bg-amber-900/20'}`}
                            onClick={() => previewMove(pair.whiteIndex)}
                          >
                            {pair.whiteMove}
                          </button>
                        )}
                        
                        {pair.blackMove && (
                          <button
                            className={`px-2 py-1 rounded text-amber-800 dark:text-amber-200 font-mono
                            ${previewIndex === pair.blackIndex 
                              ? 'bg-amber-100 dark:bg-amber-900/30' 
                              : 'hover:bg-amber-100/50 dark:hover:bg-amber-900/20'}`}
                            onClick={() => previewMove(pair.blackIndex)}
                          >
                            {pair.blackMove}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-amber-500 dark:text-amber-400 py-4">
                    No moves yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGameStatus(chess: Chess): string {
  if (!chess.isGameOver()) return "On Going";
  if (chess.isCheckmate()) {
    const winner = chess.turn() === 'w' ? 'Black' : 'White';
    return `Completed - ${winner} wins by checkmate`;
  }
  if (chess.isStalemate()) return "Completed - Stalemate";
  if (chess.isDraw()) return "Completed - Draw";
  return "Completed";
}