'use client';

import { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import { Button } from '@/components/ui/button';
import { ChessBoard } from '@/components/ChessBoard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUturnLeftIcon,
  FlagIcon,
  ArrowPathIcon,
  SignalIcon,
  ExclamationTriangleIcon,
  SignalSlashIcon,
  HomeIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { UserInfo } from '@/types/googleAuthTypes';
import { getUserInfo } from '@/lib/auth/googleAuth';

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
  playingAs: 'w' | 'b';
  gameOver?: boolean;
  engineStatus: 'connected' | 'degraded' | 'disconnected' | 'pending';
  isThinking: boolean;
  handleTakeBack: () => void;
  handleResign: () => void;
  handleRetry: () => void;
  handleAbort: () => void;
}

interface PaneProps {
  playingAs: 'w' | 'b';
  gameProps: GameProps;
}

function getGameStatus(chess: Chess, gameOver?: boolean): string {
  if (gameOver) {
    const winner = chess.turn() === 'w' ? 'Black' : 'White';
    if (chess.isCheckmate()) {
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

    if (!chess.isGameOver()) {
      const loser = chess.turn() !== 'w' ? 'Black' : 'White';
      return `${loser} Resigned, ${winner} Wins`;
    }

    return `Game ended`;
  }

  return 'Game in progress';
}

export default function ComputerGamePane({ playingAs, gameProps }: PaneProps) {
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
    gameOver,
    engineStatus,
    isThinking,
    handleTakeBack,
    handleResign,
    handleRetry,
    handleAbort,
  } = gameProps;

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const moveListRef = useRef<HTMLDivElement>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const info = getUserInfo();
    setUserInfo(info);
  }, []);

  const username = userInfo?.email?.split('@')[0] || 'anonymous';

  useEffect(() => {
    if (
      moveListRef.current &&
      chess.history().length > 0 &&
      previewIndex === null
    ) {
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
  const gameStatus = getGameStatus(chess, gameOver);
  const turnColor = chess.turn();
  const isPlayerTurn = turnColor === playingAs;

  const getEngineStatusBadge = () => {
    switch (engineStatus) {
      case 'connected':
        return (
          <Badge className="bg-green-600 text-white flex items-center gap-1">
            <SignalIcon className="h-3 w-3" />
            Connected
          </Badge>
        );
      case 'degraded':
        return (
          <Badge className="bg-amber-600 text-white flex items-center gap-1">
            <ExclamationTriangleIcon className="h-3 w-3" />
            Degraded
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge className="bg-red-600 text-white flex items-center gap-1">
            <SignalSlashIcon className="h-3 w-3" />
            Disconnected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-600 text-white flex items-center gap-1">
            <SignalIcon className="h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  const handleHome = () => {
    window.location.href = `/home`;
  };

  return (
    <Card className="w-full h-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md rounded-xl overflow-hidden">
      <CardContent className="p-4 md:p-6">
        <div className="md:hidden flex flex-col gap-4">
          <Card className="bg-white dark:bg-slate-700 border border-amber-200/50 dark:border-slate-600/50 shadow-none">
            <CardContent className="text-center p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium text-base text-amber-800 dark:text-amber-200">
                  {playingAs === 'w'
                    ? `${username} vs Computer`
                    : `Computer vs ${username}`}
                </div>
                {getEngineStatusBadge()}
              </div>
              <div className="text-sm text-amber-600 dark:text-amber-300">
                {gameStatus}
              </div>
              <div className="text-sm font-medium mt-2">
                {!gameOver && (
                  <span
                    className={
                      isPlayerTurn
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }
                  >
                    {isPlayerTurn ? 'Your turn' : 'Engine is thinking'}
                  </span>
                )}
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
                viewOnly={gameOver || previewIndex !== null || isThinking}
              />
            </div>
          </div>

          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              data-key="ArrowUp"
              className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${
                pressedKeys.has('ArrowUp')
                  ? 'translate-y-[2px] shadow-none'
                  : ''
              }`}
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
              className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${
                pressedKeys.has('ArrowLeft')
                  ? 'translate-y-[2px] shadow-none'
                  : ''
              }`}
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
              className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${
                pressedKeys.has('ArrowRight')
                  ? 'translate-y-[2px] shadow-none'
                  : ''
              }`}
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
              className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${
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

          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 p-1 bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 hover:text-amber-900 dark:bg-slate-700 dark:text-amber-200 dark:border-amber-700 dark:hover:bg-slate-600 shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[1px] dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]"
              onClick={handleTakeBack}
              disabled={gameOver || chess.history().length < 2}
              aria-label="Take Back"
            >
              <ArrowUturnLeftIcon className="h-5 w-5" />
            </Button>
            {gameOver ? (
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 p-1 bg-green-100 text-green-800 border-green-300 hover:bg-green-200 dark:bg-slate-700 dark:text-green-400 dark:border-green-700 dark:hover:bg-slate-600 shadow-[0_3px_0_0_#86efac] hover:shadow-[0_1px_0_0_#86efac] hover:translate-y-[1px] dark:shadow-[0_3px_0_0_#166534] dark:hover:shadow-[0_1px_0_0_#14532d]"
                onClick={handleHome}
                aria-label="Play Again"
              >
                <HomeIcon className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 p-1 bg-red-100 text-red-800 border-red-300 hover:bg-red-200 hover:text-red-900 dark:bg-slate-700 dark:text-red-400 dark:border-red-700 dark:hover:bg-slate-600 shadow-[0_3px_0_0_#fca5a5] hover:shadow-[0_1px_0_0_#fca5a5] hover:translate-y-[1px] dark:shadow-[0_3px_0_0_#991b1b] dark:hover:shadow-[0_1px_0_0_#7f1d1d]"
                onClick={handleResign}
                aria-label="Resign"
              >
                <FlagIcon className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 p-1 bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 hover:text-yellow-900 dark:bg-slate-700 dark:text-yellow-400 dark:border-yellow-700 dark:hover:bg-slate-600 shadow-[0_3px_0_0_#fde68a] hover:shadow-[0_1px_0_0_#fde68a] hover:translate-y-[1px] dark:shadow-[0_3px_0_0_#854d0e] dark:hover:shadow-[0_1px_0_0_#713f12]"
              onClick={handleAbort}
              disabled={gameOver}
              aria-label="Abort Game"
            >
              <XCircleIcon className="h-5 w-5" />
            </Button>
            {engineStatus === 'disconnected' && (
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 p-1 bg-green-100 text-green-800 border-green-300 hover:bg-green-200 dark:bg-slate-700 dark:text-green-400 dark:border-green-700 dark:hover:bg-slate-600 shadow-[0_3px_0_0_#86efac] hover:shadow-[0_1px_0_0_#86efac] hover:translate-y-[1px] dark:shadow-[0_3px_0_0_#166534] dark:hover:shadow-[0_1px_0_0_#14532d]"
                onClick={handleRetry}
                aria-label="Retry"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </Button>
            )}
          </div>

          <div className="bg-amber-50 dark:bg-slate-800 rounded-lg border border-amber-200/50 dark:border-amber-800/30 overflow-hidden shadow-md flex flex-col h-[300px]">
            <div
              ref={moveListRef}
              className="overflow-y-auto flex-grow max-h-[300px] px-4 font-mono text-sm"
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
                viewOnly={gameOver || previewIndex !== null}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <Card className="bg-white dark:bg-slate-700 border border-amber-200/50 dark:border-slate-600/50 shadow-none">
              <CardContent className="text-center px-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-base text-amber-800 dark:text-amber-200">
                    {playingAs === 'w'
                      ? `${username} vs Computer`
                      : `Computer vs ${username}`}
                  </div>
                  {getEngineStatusBadge()}
                </div>
                <div className="text-sm text-amber-600 dark:text-amber-300">
                  {gameStatus}
                </div>
                <div className="text-sm font-medium mt-2">
                  {!gameOver ? (
                    <span
                      className={
                        isPlayerTurn
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }
                    >
                      {isPlayerTurn ? 'Your turn' : 'Engine is thinking'}
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">
                      Game Over
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex-1 bg-amber-50 dark:bg-slate-800 rounded-lg border border-amber-200/50 dark:border-amber-800/30 overflow-hidden shadow-md flex flex-col h-[420px]">
              <div
                ref={moveListRef}
                className="overflow-y-auto flex-grow max-h-[325px] px-4 font-mono text-sm"
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
                <div className="flex justify-center items-center gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    data-key="ArrowUp"
                    className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${
                      pressedKeys.has('ArrowUp')
                        ? 'translate-y-[2px] shadow-none'
                        : ''
                    }`}
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
                    className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${
                      pressedKeys.has('ArrowLeft')
                        ? 'translate-y-[2px] shadow-none'
                        : ''
                    }`}
                    onClick={handlePrevious}
                    disabled={
                      previewIndex === 0 || chess.history().length === 0
                    }
                    aria-label="Previous move"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    data-key="ArrowRight"
                    className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${
                      pressedKeys.has('ArrowRight')
                        ? 'translate-y-[2px] shadow-none'
                        : ''
                    }`}
                    onClick={handleNext}
                    disabled={
                      previewIndex === null || chess.history().length === 0
                    }
                    aria-label="Next move"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    data-key="ArrowDown"
                    className={`w-10 h-10 p-1 bg-amber-600 hover:text-white hover:bg-amber-700 border-none text-white shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[1px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${
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

                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-1 bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 hover:text-amber-900 dark:bg-amber-600 dark:text-amber-200 dark:border-amber-600 dark:hover:bg-amber-600 shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[1px] dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]"
                    onClick={handleTakeBack}
                    disabled={gameOver || chess.history().length < 2}
                    aria-label="Take Back"
                  >
                    <ArrowUturnLeftIcon className="h-5 w-5" />
                  </Button>
                  {gameOver ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-10 h-10 p-1 bg-green-100 text-green-800 border-green-300 hover:bg-green-200 dark:bg-slate-700 dark:text-green-400 dark:border-green-700 dark:hover:bg-slate-600 shadow-[0_3px_0_0_#86efac] hover:shadow-[0_1px_0_0_#86efac] hover:translate-y-[1px] dark:shadow-[0_3px_0_0_#166534] dark:hover:shadow-[0_1px_0_0_#14532d]"
                      onClick={handleHome}
                      aria-label="Play Again"
                    >
                      <HomeIcon className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-10 h-10 p-1 bg-red-100 text-red-800 border-red-300 hover:bg-red-200 hover:text-red-900 dark:bg-red-600 dark:text-amber-200 dark:border-red-700 dark:hover:bg-red-600 shadow-[0_3px_0_0_#fca5a5] hover:shadow-[0_1px_0_0_#fca5a5] hover:translate-y-[1px] dark:shadow-[0_3px_0_0_#991b1b] dark:hover:shadow-[0_1px_0_0_#7f1d1d]"
                      onClick={handleResign}
                      aria-label="Resign"
                    >
                      <FlagIcon className="h-5 w-5" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-1 bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 hover:text-yellow-900 dark:bg-slate-700 dark:text-yellow-400 dark:border-yellow-700 dark:hover:bg-slate-600 shadow-[0_3px_0_0_#fde68a] hover:shadow-[0_1px_0_0_#fde68a] hover:translate-y-[1px] dark:shadow-[0_3px_0_0_#854d0e] dark:hover:shadow-[0_1px_0_0_#713f12]"
                    onClick={handleAbort}
                    disabled={gameOver}
                    aria-label="Abort Game"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </Button>
                  {engineStatus === 'disconnected' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-10 h-10 p-1 bg-green-100 text-green-800 border-green-300 hover:bg-green-200 dark:bg-slate-700 dark:text-green-400 dark:border-green-700 dark:hover:bg-slate-600 shadow-[0_3px_0_0_#86efac] hover:shadow-[0_1px_0_0_#86efac] hover:translate-y-[1px] dark:shadow-[0_3px_0_0_#166534] dark:hover:shadow-[0_1px_0_0_#14532d]"
                      onClick={handleRetry}
                      aria-label="Retry"
                    >
                      <ArrowPathIcon className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
