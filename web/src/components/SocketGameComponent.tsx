'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import SocketGamePane from '@/components/SocketGamePane';
import LoadingScreen from '@/components/LoadingScreen';
import { toast } from 'sonner';
import {
  AuthCallback,
  ErrorCallback,
  GameEndCallback,
  GameOutcome,
  HistoryCallback,
  MoveCallback,
} from '@/types/shared';
import { getUserInfo } from '@/lib/auth/googleAuth';
import {
  updateGamePgn,
  updateGameStatus,
  getGame,
} from '@/app/actions/gameActions';
import { GameStatus } from '@prisma/client';
import ErrorPage from '@/components/Error';
import UnauthorizedPage from '@/components/Unauthorized';
import useSocket from '@/lib/socket';

export default function SocketGameComponent({
  gameId,
  playingAs,
}: {
  gameId: string;
  playingAs: 'b' | 'w';
}) {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [lastMove, setLastMove] = useState<[Square, Square] | undefined>();
  const [selectVisible, setSelectVisible] = useState(false);
  const [pendingMove, setPendingMove] = useState<
    [Square, Square] | undefined
  >();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameOutcome, setGameOutcome] = useState<
    GameOutcome | 'Draw' | undefined
  >(undefined);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [gameInfo, setGameInfo] = useState<{
    white: string;
    black: string;
  } | null>(null);

  const lastLocalMoveRef = useRef<string | null>(null);
  const initialConnectionPhaseRef = useRef(true);
  const connectionAttemptsRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      initialConnectionPhaseRef.current = false;
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error) {
      if (gameOutcome !== undefined) {
        toast.success('Server closed, Game Completed');
      } else if (!initialConnectionPhaseRef.current) {
        toast.error(error);
      }
    }
  }, [error, gameOutcome]);

  const userInfo = getUserInfo();
  const userId = userInfo?.email?.split('@')[0] || 'anonymous';

  useEffect(() => {
    const verifyGameAccess = async () => {
      try {
        setIsAuthChecking(true);
        const gameResult = await getGame(gameId);

        if (!gameResult.success || !gameResult.game) {
          toast.error('Failed to load game');
          setHasError(true);
          setIsAuthChecking(false);
          return;
        }

        const game = gameResult.game;
        const userIsWhite = game.white === userId;
        const userIsBlack = game.black === userId;

        const isAuthorizedPlayer =
          (playingAs === 'w' && userIsWhite) ||
          (playingAs === 'b' && userIsBlack);

        if (!isAuthorizedPlayer) {
          toast.error('You are not authorized to play this game');
          setIsAuthorized(false);
          setIsAuthChecking(false);
          return;
        }

        setIsAuthorized(true);

        if (gameResult.success && gameResult.game) {
          setGameInfo({
            white: gameResult.game.white,
            black: gameResult.game.black,
          });
        }

        setIsAuthChecking(false);
      } catch (err) {
        toast.error('Error loading game');
        console.error(err);
        setHasError(true);
        setIsAuthChecking(false);
      }
    };

    verifyGameAccess();
  }, [gameId, userId, playingAs, chess]);

  const updateState = useCallback(() => {
    setFen(chess.fen());

    if (gameId) {
      const pgn = chess.pgn();
      updateGamePgn(gameId, pgn).catch((err) => {
        console.error('Failed to update game PGN:', err);
      });
    }

    if (chess.isGameOver() || chess.isDraw()) {
      setGameOver(true);

      let status: GameStatus = 'ONGOING';

      if (chess.isCheckmate()) {
        const winner = chess.turn() === 'w' ? 'b' : 'w';
        if (winner === 'w') {
          setGameOutcome({ Decisive: { winner: 'White' } });
          status = 'WHITE_WINS';
        } else {
          setGameOutcome({ Decisive: { winner: 'Black' } });
          status = 'BLACK_WINS';
        }
      } else if (chess.isDraw()) {
        setGameOutcome('Draw');
        status = 'DRAW';
      }

      if (status !== 'ONGOING' && gameId) {
        updateGameStatus(gameId, status).catch((err) => {
          console.error('Failed to update game status:', err);
        });
      }
    }
  }, [chess, gameId]);

  const socketOnAuth = useCallback<AuthCallback>(() => {
    setError(null);
    initialConnectionPhaseRef.current = false;
  }, []);

  const socketOnGameEnd = useCallback<GameEndCallback>(
    (outcome) => {
      setGameOver(true);

      let status: GameStatus = 'ONGOING';

      if (outcome === 'Draw') {
        setGameOutcome('Draw');
        status = 'DRAW';
      } else if ('Decisive' in outcome) {
        setGameOutcome(outcome);
        status =
          outcome.Decisive?.winner === 'White' ? 'WHITE_WINS' : 'BLACK_WINS';
      }

      if (gameId && status !== 'ONGOING') {
        updateGameStatus(gameId, status).catch((err) => {
          console.error('Failed to update game status on server event:', err);
        });
      }
    },
    [gameId]
  );

  const socketOnMove = useCallback<MoveCallback>(
    (moveStr) => {
      if (lastLocalMoveRef.current === moveStr) {
        lastLocalMoveRef.current = null;
        return;
      }
      try {
        const move = chess.move(moveStr);
        if (move) {
          setLastMove([move.from as Square, move.to as Square]);
          updateState();
        }
      } catch (error) {
        console.error('Invalid move received from socket:', error);
      }
    },
    [chess, updateState]
  );

  const socketOnHistory = useCallback<HistoryCallback>(
    (moves) => {
      chess.reset();
      moves.forEach((moveStr) => {
        try {
          chess.move(moveStr);
        } catch (error) {
          console.error('Invalid move in history:', error);
        }
      });
      if (moves.length > 0) {
        const lastMoveObj = chess.history({ verbose: true }).pop();
        if (lastMoveObj) {
          setLastMove([lastMoveObj.from as Square, lastMoveObj.to as Square]);
        }
      }
      updateState();
    },
    [chess, updateState]
  );

  const socketOnError = useCallback<ErrorCallback>((errorMsg) => {
    if (
      errorMsg.includes('Connection closed due to an error') ||
      errorMsg.includes('disconnect:error:')
    ) {
      connectionAttemptsRef.current += 1;
    }

    if (
      initialConnectionPhaseRef.current &&
      connectionAttemptsRef.current < 4
    ) {
      setError(errorMsg);
      return;
    }

    if (errorMsg.startsWith('disconnect:normal:')) {
      const message = errorMsg.replace('disconnect:normal:', '');
      toast.info(message);
    } else if (errorMsg.startsWith('disconnect:error:')) {
      // const message = errorMsg.replace('disconnect:error:', '');
      // toast.warning(message);
    } else {
      toast.error(errorMsg);
    }
    setError(errorMsg);
  }, []);

  const { status, move } = useSocket(
    process.env.NEXT_PUBLIC_WS_SERVER_URL || 'ws://localhost:8000/ws',
    gameId,
    userId,
    socketOnError,
    socketOnAuth,
    socketOnGameEnd,
    socketOnHistory,
    socketOnMove
  );

  // const isLoading = status === 'connecting';
  const isConnected = status === 'authenticated';

  const onMove = useCallback(
    (from: Square, to: Square) => {
      if (previewIndex !== null) {
        setPreviewIndex(null);
        return;
      }
      if (chess.turn() !== playingAs) {
        return;
      }
      const moves = chess.moves({ verbose: true });
      const moveFound = moves.find((m) => m.from === from && m.to === to);
      if (!moveFound) return;
      if (moveFound.promotion) {
        setPendingMove([from, to]);
        setSelectVisible(true);
      } else {
        const moveResult = chess.move({ from, to });
        if (moveResult) {
          lastLocalMoveRef.current = moveResult.san;
          setLastMove([from, to]);
          updateState();
          move(moveResult.san);
        }
      }
    },
    [chess, previewIndex, updateState, playingAs, move]
  );

  const promotion = useCallback(
    (piece: 'q' | 'r' | 'n' | 'b') => {
      if (!pendingMove) return;
      const [from, to] = pendingMove;
      const moveResult = chess.move({ from, to, promotion: piece });
      if (moveResult) {
        lastLocalMoveRef.current = moveResult.san;
        setLastMove([from, to]);
        setSelectVisible(false);
        updateState();
        move(moveResult.san);
      }
    },
    [chess, pendingMove, updateState, move]
  );

  const previewMove = useCallback(
    (index: number) => {
      if (index >= chess.history().length) setPreviewIndex(null);
      else setPreviewIndex(index);
    },
    [chess]
  );

  const handleFirstMove = useCallback(() => {
    if (chess.history().length > 0) {
      setPreviewIndex(0);
    }
  }, [chess]);

  const handlePrevious = useCallback(() => {
    if (previewIndex === null && chess.history().length > 0) {
      setPreviewIndex(chess.history().length - 2);
    } else if (previewIndex !== null && previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
    }
  }, [previewIndex, chess]);

  const handleNext = useCallback(() => {
    if (previewIndex !== null && previewIndex < chess.history().length - 1) {
      setPreviewIndex(previewIndex + 1);
    } else if (
      previewIndex !== null &&
      previewIndex === chess.history().length - 1
    ) {
      setPreviewIndex(null);
    }
  }, [previewIndex, chess]);

  const handleLastMove = useCallback(() => {
    setPreviewIndex(null);
  }, []);

  const calcPreviewFen = useCallback(() => {
    if (previewIndex === null) return null;
    const temp = new Chess();
    const history = chess.history({ verbose: true });
    for (let i = 0; i <= previewIndex && i < history.length; i++) {
      temp.move(history[i].san);
    }
    return temp.fen();
  }, [previewIndex, chess]);

  const reconnect = useCallback(() => {
    window.location.reload();
  }, []);

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
    isConnected,
    gameId,
    playingAs,
    gameOver,
    gameOutcome,
    reconnect,
    white: gameInfo?.white,
    black: gameInfo?.black,
  };

  if (isAuthChecking) {
    return <LoadingScreen />;
  }

  if (!gameId) {
    return <ErrorPage message="No game ID provided" code="400" />;
  }

  if (!isAuthorized) {
    return <UnauthorizedPage />;
  }

  if (hasError) {
    return (
      <ErrorPage message="There was a problem loading this game" code="500" />
    );
  }

  return (
    <div className="mx-auto px-12 py-8">
      <SocketGamePane playingAs={playingAs} gameProps={gameProps} />
    </div>
  );
}
