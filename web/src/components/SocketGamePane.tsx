'use client';

import { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import { Button } from '@/components/ui/button';
import { ChessBoard } from '@/components/ChessBoard';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SignalIcon,
  SignalSlashIcon,
} from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';
import { GameOutcome } from '@/types/socket-types';

interface GameProps {
  chess: Chess;
  fen: string;
  lastMove?: [Square, Square];
  selectVisible: boolean;
  pendingMove?: [Square, Square];
  previewIndex: number | null;
  previewFen: string | null;
  onMove: (from: Square, to: Square) => void;
  promotion: (piece: 'q' | 'r' | 'n' | 'b') => void;
  previewMove: (index: number) => void;
  handleFirstMove: () => void;
  handlePrevious: () => void;
  handleNext: () => void;
  handleLastMove: () => void;
  isConnected: boolean;
  gameId: string;
  playingAs: 'w' | 'b';
  gameOver?: boolean;
  gameOutcome?: GameOutcome;
  reconnect?: () => void;
}

interface PaneProps {
  playingAs: 'w' | 'b';
  gameProps: GameProps;
}

function getGameStatus(
  chess: Chess,
  gameOver?: boolean,
  gameOutcome?: GameOutcome | null
): string {
  if (gameOver && gameOutcome) {
    switch (gameOutcome.type) {
      case 'Decisive':
        return gameOutcome.winner === 'w' ? 'White wins' : 'Black wins';
      case 'Draw':
        return 'Game ended in a draw';
      case 'Ongoing':
        return 'Game in progress';
      default:
        return 'Game ended';
    }
  }

  if (chess.isGameOver()) {
    if (chess.isCheckmate()) {
      const winner = chess.turn() === 'w' ? 'Black' : 'White';
      return `${winner} wins by checkmate`;
    }
    
    if (chess.isStalemate()) {
      return 'Draw by stalemate';
    }
    
    if (chess.isThreefoldRepetition()) {
      return 'Draw by repetition';
    }
    
    if (chess.isInsufficientMaterial()) {
      return 'Draw by insufficient material';
    }
    
    if (chess.isDrawByFiftyMoves()) {
      return 'Draw by fifty-move rule';
    }
    
    return 'Draw';
  }

  return 'Game in progress';
}

export default function SocketGamePane({ playingAs, gameProps }: PaneProps) {
  const {
    chess,
    fen,
    lastMove,
    selectVisible,
    previewIndex,
    previewFen,
    onMove,
    promotion,
    previewMove,
    handleFirstMove,
    handlePrevious,
    handleNext,
    handleLastMove,
    isConnected,
    gameId,
    gameOver,
    gameOutcome,
    reconnect,
  } = gameProps;

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [copySuccess, setCopySuccess] = useState(false);
  const [showGameInfo, setShowGameInfo] = useState(false);
  const moveListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (moveListRef.current && chess.history().length > 0 && previewIndex === null) {
      moveListRef.current.scrollTop = moveListRef.current.scrollHeight;
    }
  }, [chess, previewIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        setPressedKeys((prev) => new Set(prev).add(e.key));
        if (e.key === 'ArrowLeft') handlePrevious();
        else if (e.key === 'ArrowRight') handleNext();
        else if (e.key === 'ArrowUp') handleFirstMove();
        else if (e.key === 'ArrowDown') handleLastMove();
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
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handlePrevious, handleNext, handleFirstMove, handleLastMove]);

  const movePairs = [];
  const history = chess.history();
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      whiteMove: history[i],
      blackMove: i + 1 < history.length ? history[i + 1] : undefined,
      whiteIndex: i,
      blackIndex: i + 1,
    });
  }

  const boardFen = previewFen ? previewFen : fen;
  const gameStatus = getGameStatus(chess, gameOver, gameOutcome);
  const turnColor = chess.turn();
  const isPlayerTurn = turnColor === playingAs;

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/socket?game_id=${gameId}&playas=${playingAs === 'w' ? 'b' : 'w'}`;
    navigator.clipboard.writeText(inviteLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const toggleGameInfo = () => {
    setShowGameInfo(!showGameInfo);
  };

  return (
    <Card className="w-full h-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md rounded-xl overflow-hidden">
      <CardContent className="p-4 md:p-6">
        <div className="md:hidden flex flex-col gap-4">
          <Card className="bg-white dark:bg-slate-700 border border-amber-200/50 dark:border-slate-600/50 shadow-none">
            <CardContent className="text-center">
              <div className="font-medium text-base text-amber-800 dark:text-amber-200">
                Player A (1600) - Player B (1600)
              </div>
              <div className="text-sm text-amber-600 dark:text-amber-300">{gameStatus}</div>
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
                viewOnly={gameOver || previewIndex !== null}
              />
            </div>
          </div>
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              data-key="ArrowUp"
              className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${pressedKeys.has('ArrowUp') ? 'translate-y-[2px] shadow-none' : ''}`}
              onClick={handleFirstMove}
              disabled={chess.history().length === 0}
              aria-label="First move"
            >
              <ChevronDoubleLeftIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              data-key="ArrowLeft"
              className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${pressedKeys.has('ArrowLeft') ? 'translate-y-[2px] shadow-none' : ''}`}
              onClick={handlePrevious}
              disabled={previewIndex === 0 || chess.history().length === 0}
              aria-label="Previous move"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              data-key="ArrowRight"
              className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${pressedKeys.has('ArrowRight') ? 'translate-y-[2px] shadow-none' : ''}`}
              onClick={handleNext}
              disabled={previewIndex === null || chess.history().length === 0}
              aria-label="Next move"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              data-key="ArrowDown"
              className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${pressedKeys.has('ArrowDown') ? 'translate-y-[2px] shadow-none' : ''}`}
              onClick={handleLastMove}
              disabled={previewIndex === null}
              aria-label="Last move"
            >
              <ChevronDoubleRightIcon className="h-5 w-5" />
            </Button>
          </div>
          <div className="bg-amber-50 dark:bg-slate-800 rounded-lg border border-amber-200/50 dark:border-amber-800/30 overflow-hidden shadow-md flex flex-col h-[300px]">
            <div ref={moveListRef} className="overflow-y-auto flex-grow max-h-[300px] px-4 font-mono text-sm">
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
                      <tr key={move.moveNumber} className="hover:bg-amber-50 dark:hover:bg-amber-900/20">
                        <td className="py-1 text-amber-600 dark:text-amber-400">{move.moveNumber}.</td>
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
                      <td colSpan={3} className="text-center text-amber-500 dark:text-amber-400 py-4">
                        No moves yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Card
            className="bg-white dark:bg-slate-700 border border-amber-200/50 dark:border-slate-600/50 shadow-none cursor-pointer py-4"
            onClick={toggleGameInfo}
          >
            <CardContent className="px-4 py-0 transition-all">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-amber-800 dark:text-amber-200">Game Info</span>
                  <Badge variant={isConnected ? 'default' : 'destructive'} className={`${isConnected ? 'bg-green-600' : 'bg-red-600'} text-white flex items-center gap-1`}>
                    {isConnected ? <SignalIcon className="h-3 w-3" /> : <SignalSlashIcon className="h-3 w-3" />}
                  </Badge>
                </div>
                {showGameInfo ? (
                  <ChevronUpIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              {showGameInfo && (
                <div className="mt-3 pt-3 border-t border-amber-200/30 dark:border-slate-700/30">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-amber-600 dark:text-amber-300">
                      Game ID: <span className="font-medium">{gameId}</span>
                    </div>
                    {!isConnected && reconnect && (
                      <Button size="sm" className="h-7 text-xs bg-amber-600" onClick={(e) => { e.stopPropagation(); reconnect(); }}>
                        Reconnect
                      </Button>
                    )}
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-amber-600 dark:text-amber-300">
                      Playing as: <span className="font-medium">{playingAs === 'w' ? 'White' : 'Black'}</span>
                    </div>
                    {!gameOver && isConnected && (
                      <div className="text-sm font-medium">
                        {isPlayerTurn ? (
                          <span className="text-green-600 dark:text-green-400">Your turn</span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400">Opponent&apos;s turn</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mb-2 text-sm font-medium">
                    {gameStatus.includes('wins') ? (
                      <span className={gameStatus.toLowerCase().includes(playingAs === 'w' ? 'white' : 'black') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {gameStatus}
                      </span>
                    ) : (
                      <span className="text-amber-700 dark:text-amber-300">{gameStatus}</span>
                    )}
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    Share with opponent:
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 p-2 bg-amber-50 dark:bg-slate-800 rounded border border-amber-200/50 dark:border-amber-800/30 text-xs truncate">
                        {typeof window !== 'undefined'
                          ? `${window.location.origin}/socket?game_id=${gameId}&playas=${playingAs === 'w' ? 'b' : 'w'}`
                          : ''}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 rounded-md border-amber-300 text-amber-800 hover:bg-amber-50 shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[2px] dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50 dark:shadow-[0_3px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyInviteLink();
                        }}
                      >
                        {copySuccess ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600 dark:text-green-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                          </svg>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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
                viewOnly={gameOver || previewIndex !== null}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <Card className="bg-white dark:bg-slate-700 border border-amber-200/50 dark:border-slate-600/50 shadow-none">
              <CardContent className="text-center">
                <div className="font-medium text-base text-amber-800 dark:text-amber-200">
                  Player A (1600) - Player B (1600)
                </div>
                <div className="text-sm text-amber-600 dark:text-amber-300">{gameStatus}</div>
              </CardContent>
            </Card>
            <div className="flex-1 bg-amber-50 dark:bg-slate-800 rounded-lg border border-amber-200/50 dark:border-amber-800/30 overflow-hidden shadow-md flex flex-col h-[400px]">
              <div ref={moveListRef} className="overflow-y-auto flex-grow max-h-[365px] px-4 font-mono text-sm">
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
                        <tr key={move.moveNumber} className="hover:bg-amber-50 dark:hover:bg-amber-900/20">
                          <td className="py-1 text-amber-600 dark:text-amber-400">{move.moveNumber}.</td>
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
                        <td colSpan={3} className="text-center text-amber-500 dark:text-amber-400 py-4">
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
                    className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${pressedKeys.has('ArrowUp') ? 'translate-y-[2px] shadow-none' : ''}`}
                    onClick={handleFirstMove}
                    disabled={chess.history().length === 0}
                    aria-label="First move"
                  >
                    <ChevronDoubleLeftIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    data-key="ArrowLeft"
                    className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${pressedKeys.has('ArrowLeft') ? 'translate-y-[2px] shadow-none' : ''}`}
                    onClick={handlePrevious}
                    disabled={previewIndex === 0 || chess.history().length === 0}
                    aria-label="Previous move"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    data-key="ArrowRight"
                    className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${pressedKeys.has('ArrowRight') ? 'translate-y-[2px] shadow-none' : ''}`}
                    onClick={handleNext}
                    disabled={previewIndex === null || chess.history().length === 0}
                    aria-label="Next move"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    data-key="ArrowDown"
                    className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${pressedKeys.has('ArrowDown') ? 'translate-y-[2px] shadow-none' : ''}`}
                    onClick={handleLastMove}
                    disabled={previewIndex === null}
                    aria-label="Last move"
                  >
                    <ChevronDoubleRightIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            <Card className="bg-white dark:bg-slate-700 border border-amber-200/50 dark:border-slate-600/50 shadow-none cursor-pointer py-4" onClick={toggleGameInfo}>
              <CardContent className="py-0 px-4 transition-all">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-amber-800 dark:text-amber-200">Game Info</span>
                    <Badge variant={isConnected ? 'default' : 'destructive'} className={`${isConnected ? 'bg-green-600' : 'bg-red-600'} text-white flex items-center gap-1`}>
                      {isConnected ? <SignalIcon className="h-3 w-3" /> : <SignalSlashIcon className="h-3 w-3" />}
                    </Badge>
                  </div>
                  {showGameInfo ? (
                    <ChevronUpIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                {showGameInfo && (
                  <div className="mt-3 pt-3 border-t border-amber-200/30 dark:border-slate-700/30">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-amber-600 dark:text-amber-300">Game ID: <span className="font-medium">{gameId}</span></div>
                      {!isConnected && reconnect && (
                        <Button size="sm" className="h-7 text-xs bg-amber-600" onClick={(e) => { e.stopPropagation(); reconnect(); }}>
                          Reconnect
                        </Button>
                      )}
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-amber-600 dark:text-amber-300">Playing as: <span className="font-medium">{playingAs === 'w' ? 'White' : 'Black'}</span></div>
                      {!gameOver && isConnected && (
                        <div className="text-sm font-medium">
                          {isPlayerTurn ? <span className="text-green-600 dark:text-green-400">Your turn</span> : <span className="text-amber-600 dark:text-amber-400">Opponent&apos;s turn</span>}
                        </div>
                      )}
                    </div>
                    <div className="mb-2 text-sm font-medium">
                      {gameStatus.includes('wins') ? (
                        <span className={gameStatus.toLowerCase().includes(playingAs === 'w' ? 'white' : 'black') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>{gameStatus}</span>
                      ) : (
                        <span className="text-amber-700 dark:text-amber-300">{gameStatus}</span>
                      )}
                    </div>
                    <div className="text-sm text-amber-700 dark:text-amber-300">
                      Share with opponent:
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 p-2 bg-amber-50 dark:bg-slate-800 rounded border border-amber-200/50 dark:border-amber-800/30 text-xs truncate">
                          {typeof window !== 'undefined'
                            ? `${window.location.origin}/socket?game_id=${gameId}&playas=${playingAs === 'w' ? 'b' : 'w'}`
                            : ''}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 p-0 rounded-md border-amber-300 text-amber-800 hover:bg-amber-50 shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[2px] dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50 dark:shadow-[0_3px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyInviteLink();
                          }}
                        >
                          {copySuccess ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600 dark:text-green-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                            </svg>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
