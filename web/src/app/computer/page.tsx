'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import ComputerGamePane from '@/components/ComputerGamePane';
import LoadingScreen from '@/components/LoadingScreen';
import UnauthorizedPage from '@/components/Unauthorized';
import ErrorPage from '@/components/Error';
import { toast } from 'sonner';
import { testEngine, getBestMove } from '@/lib/engine';
import {
  updateGamePgn,
  updateGameStatus,
  getGame,
} from '@/app/actions/gameActions';
import { getUserInfo } from '@/lib/auth/googleAuth';
import { GameStatus } from '@prisma/client';
import { useSearchParams } from 'next/navigation';

export default function ComputerGame() {
  const searchParams = useSearchParams();

  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [lastMove, setLastMove] = useState<[Square, Square]>();
  const [selectVisible, setSelectVisible] = useState(false);
  const [pendingMove, setPendingMove] = useState<[Square, Square]>();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [playingAs, setPlayingAs] = useState<'w' | 'b'>('w');
  const [engineStatus, setEngineStatus] = useState<
    'connected' | 'degraded' | 'disconnected' | 'pending'
  >('pending');
  const [isThinking, setIsThinking] = useState(false);
  const [gameId, setGameId] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hasError, setHasError] = useState(false);

  const moveHistory = useRef<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSuccessRef = useRef<number | null>(null);

  const userInfo = getUserInfo();
  const username = userInfo?.email?.split('@')[0] || 'anonymous';

  useEffect(() => {
    const urlGameId = searchParams.get('game_id');
    const colorParam = searchParams.get('color');

    if (!urlGameId) {
      toast.error('No game ID provided');
      setIsLoading(false);
      return;
    }

    if (colorParam !== 'w' && colorParam !== 'b') {
      toast.error('Invalid color parameter');
      setIsLoading(false);
      return;
    }

    setPlayingAs(colorParam);
    setGameId(urlGameId);

    const initializeGame = async () => {
      try {
        const gameResult = await getGame(urlGameId);

        if (!gameResult.success || !gameResult.game) {
          console.error('Failed to load game data:', gameResult.error);
          toast.error('Failed to load game');
          setHasError(true);
          return;
        }

        const game = gameResult.game;

        const userIsWhite = game.white === username;
        const userIsBlack = game.black === username;
        const computerIsWhite = game.white === 'computer';
        const computerIsBlack = game.black === 'computer';

        const isAuthorizedPlayer =
          (colorParam === 'w' && userIsWhite && computerIsBlack) ||
          (colorParam === 'b' && userIsBlack && computerIsWhite);

        if (!isAuthorizedPlayer) {
          toast.error('You are not authorized to play this game');
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        setIsAuthorized(true);

        if (game.pgn) {
          try {
            chess.loadPgn(game.pgn);
            moveHistory.current = chess.history();

            const history = chess.history({ verbose: true });
            if (history.length > 0) {
              const last = history[history.length - 1];
              setLastMove([last.from as Square, last.to as Square]);
            }

            setFen(chess.fen());
          } catch (err) {
            console.error('Error loading PGN:', err);
            setHasError(true);
            return;
          }
        }

        if (game.status !== 'ONGOING') {
          setGameOver(true);
        }
      } catch (err) {
        console.error('Error initializing game:', err);
        toast.error('Error loading game');
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeGame();
  }, [searchParams, username, chess]);

  useEffect(() => {
    const updateStatusByAge = () => {
      const last = lastSuccessRef.current;
      if (last === null) {
        setEngineStatus('disconnected');
        setError('Failed to connect to chess engine');
        toast.error('Engine connection failed', {
          description: 'Unable to connect to the chess engine',
        });
        return;
      }
      const age = Date.now() - last;
      if (age >= 60000) {
        setEngineStatus('disconnected');
        setError('Chess engine unreachable (timeout)');
        toast.error('Engine disconnected', {
          description: 'No response from engine for over 60 s',
        });
      } else if (age >= 30000) {
        if (engineStatus !== 'degraded') {
          setEngineStatus('degraded');
          setError('Engine connection degraded');
          toast.warning('Engine connection degraded', {
            description: 'Responses taking too long',
          });
        }
      } else {
        if (engineStatus !== 'connected') {
          setEngineStatus('connected');
          setError(null);
          toast.success('Engine reconnected');
        }
      }
    };

    const ping = async () => {
      try {
        const res = await testEngine();
        if (res.status === 'success') {
          lastSuccessRef.current = Date.now();
          setError(null);
          setEngineStatus('connected');
        } else {
          if (lastSuccessRef.current === null)
            lastSuccessRef.current = Date.now();
          updateStatusByAge();
        }
      } catch {
        updateStatusByAge();
      }
    };

    ping();
    const id = setInterval(ping, 5000);
    return () => clearInterval(id);
  }, [engineStatus]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const updateState = useCallback(() => {
    setFen(chess.fen());

    if (gameId) {
      const pgn = chess.pgn();
      updateGamePgn(gameId, pgn).catch(console.error);
    }

    const ended = chess.isGameOver();
    setGameOver((prev) => prev || ended);

    if (ended && gameId) {
      let status: GameStatus = 'ONGOING';

      if (chess.isCheckmate()) {
        status = chess.turn() === 'w' ? 'BLACK_WINS' : 'WHITE_WINS';
      } else if (chess.isDraw()) {
        status = 'DRAW';
      }

      if (status !== 'ONGOING')
        updateGameStatus(gameId, status).catch(console.error);
    }
  }, [chess, gameId]);

  const makeComputerMove = useCallback(async () => {
    if (gameOver || chess.turn() === playingAs || isThinking) return;
    setIsThinking(true);
    try {
      const { best_move } = await getBestMove(chess.fen());
      if (best_move) {
        const from = best_move.slice(0, 2) as Square;
        const to = best_move.slice(2, 4) as Square;
        const promotion =
          best_move.length > 4
            ? (best_move[4] as 'q' | 'r' | 'n' | 'b')
            : undefined;
        const m = chess.move({ from, to, promotion });
        if (m) {
          setLastMove([from, to]);
          moveHistory.current.push(m.san);
          updateState();
        }
      }
    } catch {
      setEngineStatus('degraded');
      toast.error('Engine move failed', {
        description: 'Could not get best move from engine',
      });
    } finally {
      setIsThinking(false);
    }
  }, [chess, gameOver, playingAs, isThinking, updateState]);

  const onMove = useCallback(
    (from: Square, to: Square) => {
      if (previewIndex !== null) {
        setPreviewIndex(null);
        return;
      }
      if (chess.turn() !== playingAs || gameOver || isThinking) return;
      const moves = chess.moves({ verbose: true });
      const mv = moves.find((m) => m.from === from && m.to === to);
      if (!mv) return;
      if (mv.promotion) {
        setPendingMove([from, to]);
        setSelectVisible(true);
      } else {
        const m = chess.move({ from, to });
        if (m) {
          setLastMove([from, to]);
          moveHistory.current.push(m.san);
          updateState();
          timeoutRef.current = setTimeout(makeComputerMove, 500);
        }
      }
    },
    [
      chess,
      previewIndex,
      updateState,
      playingAs,
      gameOver,
      isThinking,
      makeComputerMove,
    ]
  );

  const promotion = useCallback(
    (p: 'q' | 'r' | 'n' | 'b') => {
      if (!pendingMove) return;
      const [from, to] = pendingMove;
      const m = chess.move({ from, to, promotion: p });
      if (m) {
        setLastMove([from, to]);
        moveHistory.current.push(m.san);
        setSelectVisible(false);
        updateState();
        timeoutRef.current = setTimeout(makeComputerMove, 500);
      }
    },
    [chess, pendingMove, updateState, makeComputerMove]
  );

  useEffect(() => {
    if (!isLoading && isAuthorized && playingAs === 'b') {
      makeComputerMove();
    }
  }, [isLoading, isAuthorized, playingAs, makeComputerMove]);

  const previewMove = useCallback((i: number) => {
    setPreviewIndex(i >= moveHistory.current.length ? null : i);
  }, []);

  const handleFirstMove = useCallback(() => {
    if (moveHistory.current.length) setPreviewIndex(0);
  }, []);

  const handlePrevious = useCallback(() => {
    if (previewIndex === null) {
      if (moveHistory.current.length)
        setPreviewIndex(moveHistory.current.length - 2);
    } else if (previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
    }
  }, [previewIndex]);

  const handleNext = useCallback(() => {
    if (previewIndex === null) return;
    if (previewIndex < moveHistory.current.length - 1)
      setPreviewIndex(previewIndex + 1);
    else setPreviewIndex(null);
  }, [previewIndex]);

  const handleLastMove = useCallback(() => setPreviewIndex(null), []);

  const calcPreviewFen = useCallback(() => {
    if (previewIndex === null) return null;
    const tmp = new Chess();
    const hist = chess.history({ verbose: true });
    for (let i = 0; i <= previewIndex && i < hist.length; i++)
      tmp.move(hist[i].san);
    return tmp.fen();
  }, [previewIndex, chess]);

  const handleTakeBack = useCallback(() => {
    if (gameOver || moveHistory.current.length < 2) return;
    chess.undo();
    chess.undo();
    moveHistory.current.pop();
    moveHistory.current.pop();
    const h = chess.history({ verbose: true });
    if (h.length) {
      const last = h[h.length - 1];
      setLastMove([last.from as Square, last.to as Square]);
    } else {
      setLastMove(undefined);
    }
    updateState();
  }, [chess, gameOver, updateState]);

  const handleResign = useCallback(() => {
    if (gameOver) return;
    setGameOver(true);

    if (gameId) {
      const status: GameStatus =
        playingAs === 'w' ? 'BLACK_WINS' : 'WHITE_WINS';
      updateGameStatus(gameId, status).catch((err) => {
        console.error('Failed to update game status on resign:', err);
      });
    }

    toast.info('Game ended', { description: 'You resigned the game' });
  }, [gameOver, gameId, playingAs]);

  const handleRetry = useCallback(() => {
    if (engineStatus !== 'disconnected') return;
    setIsLoading(true);
    testEngine()
      .then((res) => {
        if (res.status === 'success') {
          setEngineStatus('connected');
          setError(null);
          toast.success('Engine connection restored');
        } else {
          setEngineStatus('degraded');
          setError('Engine connection degraded');
          toast.warning('Engine connection degraded');
        }
      })
      .catch(() => {
        setEngineStatus('disconnected');
        setError('Failed to connect to chess engine');
        toast.error('Engine connection failed');
      })
      .finally(() => setIsLoading(false));
  }, [engineStatus]);

  const gameProps = {
    chess,
    fen,
    lastMove,
    selectVisible,
    pendingMove,
    previewIndex,
    previewFen: calcPreviewFen(),
    onMove,
    promotion,
    previewMove,
    handleFirstMove,
    handlePrevious,
    handleNext,
    handleLastMove,
    playingAs,
    gameOver,
    engineStatus,
    isThinking,
    handleTakeBack,
    handleResign,
    handleRetry,
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (hasError) {
    return (
      <ErrorPage message="There was a problem loading this game" code="500" />
    );
  }

  if (!isAuthorized) {
    return <UnauthorizedPage />;
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <ComputerGamePane playingAs={playingAs} gameProps={gameProps} />
    </div>
  );
}
