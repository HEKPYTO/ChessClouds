'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import SocketGamePane from '@/components/SocketGamePane';
import { SocketService } from '@/lib/socketService';
import LoadingScreen from '@/components/LoadingScreen';
import { toast } from 'sonner';
import { GameOutcome } from '@/types/shared';
import { getUserInfo } from '@/lib/auth/googleAuth';
import {
  updateGamePgn,
  updateGameStatus,
  getGame,
} from '@/app/actions/gameActions';
import { GameStatus } from '@prisma/client';
import ErrorPage from '@/components/Error';
import UnauthorizedPage from '@/components/Unauthorized';
import { useSearchParams } from 'next/navigation';

export default function SocketGame() {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [lastMove, setLastMove] = useState<[Square, Square] | undefined>();
  const [selectVisible, setSelectVisible] = useState(false);
  const [pendingMove, setPendingMove] = useState<
    [Square, Square] | undefined
  >();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameOutcome, setGameOutcome] = useState<
    GameOutcome | 'Draw' | undefined
  >(undefined);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hasError, setHasError] = useState(false);

  const lastLocalMoveRef = useRef<string | null>(null);

  const searchParams = useSearchParams();
  const gameId = searchParams.get('game_id') || '';
  const roleParam = searchParams.get('playas');
  const playingAs: 'w' | 'b' =
    roleParam === 'w' || roleParam === 'b' ? (roleParam as 'w' | 'b') : 'w';

  useEffect(() => {
    if (error) {
      if (gameOutcome !== undefined) {
        toast.success('Server closed, Game Completed');
      } else {
        toast.error(error);
      }
    }
  }, [error, gameOutcome]);

  const userInfo = getUserInfo();
  const userId = userInfo?.email?.split('@')[0] || 'anonymous';

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

  useEffect(() => {
    if (!gameId) {
      setIsLoading(false);
      setError('No game ID provided');
      return;
    }

    const initializeGame = async () => {
      try {
        const gameResult = await getGame(gameId);

        if (!gameResult.success || !gameResult.game) {
          console.error('Failed to load game data:', gameResult.error);
          toast.error('Failed to load game');
          setHasError(true);
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
          setIsLoading(false);
          return;
        }

        setIsAuthorized(true);

        if (game.pgn) {
          try {
            const movesOnly = game.pgn
              .replace(/^(\[.*\][\r\n]*)*/gm, '')
              .trim();
            chess.loadPgn(movesOnly);
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

          if (game.status === 'WHITE_WINS') {
            setGameOutcome({ Decisive: { winner: 'White' } });
          } else if (game.status === 'BLACK_WINS') {
            setGameOutcome({ Decisive: { winner: 'Black' } });
          } else if (game.status === 'DRAW') {
            setGameOutcome('Draw');
          }
        }
      } catch (err) {
        console.error('Error initializing game:', err);
        toast.error('Error loading game');
        setHasError(true);
      }

      const socketService = SocketService.getInstance();
      let retries = 0;
      const maxRetries = 3;
      const retryDelay = 5000;

      socketService.onConnect(() => {
        setIsConnected(true);
        setIsLoading(false);
        setError(null);
      });

      socketService.onMove((moveStr) => {
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
      });

      socketService.onHistory((moves) => {
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
      });

      socketService.onGameEnd((outcome) => {
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
      });

      socketService.onError((errorMsg) => {
        retries += 1;
        if (!isConnected && retries < maxRetries) {
          setTimeout(() => {
            socketService.connect(gameId, userId);
          }, retryDelay);
        } else if (!isConnected) {
          setIsLoading(false);
          toast.error(
            'Unable to connect to game server. Please try again later'
          );
          console.error(errorMsg);
        }
      });

      socketService.connect(gameId, userId);
    };

    setIsLoading(true);
    initializeGame();

    return () => {
      const socketService = SocketService.getInstance();
      socketService.onConnect(() => {});
      socketService.onMove(() => {});
      socketService.onHistory(() => {});
      socketService.onGameEnd(() => {});
      socketService.onError(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, userId, isConnected]);

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
          SocketService.getInstance().sendMove(moveResult.san);
        }
      }
    },
    [chess, previewIndex, updateState, playingAs]
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
        SocketService.getInstance().sendMove(moveResult.san);
      }
    },
    [chess, pendingMove, updateState]
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
    setIsLoading(true);
    setError(null);
    SocketService.getInstance().connect(gameId, userId);
  }, [gameId, userId]);

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
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!gameId) {
    return <ErrorPage message="No game ID provided" code="400" />;
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
    <div className="mx-auto px-12 py-8">
      <SocketGamePane playingAs={playingAs} gameProps={gameProps} />
    </div>
  );
}
