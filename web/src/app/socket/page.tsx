'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import SocketGamePane from '@/components/SocketGamePane';
import { SocketService } from '@/lib/socketService';
import LoadingScreen from '@/components/LoadingScreen';
import { toast } from 'sonner';
import type { GameOutcome } from '@/types/socket-types';
import { getUserInfo } from '@/lib/auth/googleAuth';

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
  const [gameOutcome, setGameOutcome] = useState<GameOutcome | undefined>(
    undefined
  );
  const [gameId, setGameId] = useState('');
  const [playingAs, setPlayingAs] = useState<'w' | 'b'>('w');

  const lastLocalMoveRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('game_id');
      const role = params.get('playas');
      if (id) setGameId(id);
      if (role === 'w' || role === 'b') setPlayingAs(role);
    }
  }, []);

  useEffect(() => {
    if (error) {
      if (gameOutcome != undefined) {
        toast.success('Server closed, Game Completed');
      } else {
        toast.error(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const userInfo = getUserInfo();
  const userId = userInfo?.email?.split('@')[0] || 'anonymous';

  const updateState = useCallback(() => {
    setFen(chess.fen());
    if (chess.isGameOver() || chess.isDraw()) {
      setGameOver(true);
      if (chess.isCheckmate()) {
        const winner = chess.turn() === 'w' ? 'b' : 'w';
        setGameOutcome({ type: 'Decisive', winner });
      } else {
        setGameOutcome({ type: 'Draw' });
      }
    }
  }, [chess]);

  useEffect(() => {
    const socketService = SocketService.getInstance();

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
      if (outcome === 'Draw') {
        setGameOutcome({ type: 'Draw' });
      } else {
        setGameOutcome(outcome as GameOutcome);
      }
    });

    socketService.onError((errorMsg) => {
      setError(errorMsg);
      if (!isConnected) {
        setIsLoading(false);
      }
    });

    socketService.connect(gameId, userId);

    return () => {
      socketService.onConnect(() => { });
      socketService.onMove(() => { });
      socketService.onHistory(() => { });
      socketService.onGameEnd(() => { });
      socketService.onError(() => { });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chess, gameId, userId]);

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
      setPreviewIndex(chess.history().length - 1);
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

  return (
    <div className="mx-auto px-12 py-8">
      <SocketGamePane playingAs={playingAs} gameProps={gameProps} />
    </div>
  );
}
