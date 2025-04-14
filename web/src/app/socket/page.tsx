'use client';

import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import SocketGamePane from '@/components/SocketGamePane';
import { SocketService } from '@/lib/socketService';
import LoadingScreen from '@/components/LoadingScreen';

export default function SocketGame() {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [lastMove, setLastMove] = useState<[Square, Square] | undefined>();
  const [selectVisible, setSelectVisible] = useState(false);
  const [pendingMove, setPendingMove] = useState<[Square, Square] | undefined>();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [socket, setSocket] = useState<SocketService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameOutcome, setGameOutcome] = useState<any>(null);

  const [gameId, setGameId] = useState('game123');
  const [playingAs, setPlayingAs] = useState<'w' | 'b'>('w');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('game_id');
      const role = params.get('playas');
      
      if (id) setGameId(id);
      if (role === 'w' || role === 'b') setPlayingAs(role);
    }
  }, []);

  const userId = playingAs === 'w' ? 'white' : 'black';

  useEffect(() => {
    const initializeGame = async () => {
      try {
        await fetch(`/init`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            game_id: gameId,
            white_user_id: 'white',
            black_user_id: 'black'
          })
        });
      } catch (err) {
        console.error("Failed to initialize game:", err);
      }
    };

    initializeGame();

    const socketService = new SocketService();
    setSocket(socketService);
    
    socketService.onConnect(() => {
      setIsConnected(true);
      setIsLoading(false);
      setError(null);
    });

    socketService.onMove((moveStr) => {
      try {
        const move = chess.move(moveStr);
        if (move) {
          setLastMove([move.from as Square, move.to as Square]);
          updateState();
        }
      } catch (error) {}
    });

    socketService.onHistory((moves) => {
      chess.reset();
      moves.forEach(moveStr => {
        try {
          chess.move(moveStr);
        } catch (error) {}
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
      setGameOutcome(outcome);
    });

    socketService.onError((errorMsg) => {
      setError(errorMsg);
      if (!isConnected) {
        setIsLoading(false);
      }
    });

    setTimeout(() => {
      socketService.connect(gameId, userId);
    }, 1000);

    return () => {
      socketService.disconnect();
    };
  }, [chess, gameId, userId]);

  const updateState = useCallback(() => {
    setFen(chess.fen());
  }, [chess]);

  const onMove = useCallback((from: Square, to: Square) => {
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
        setLastMove([from, to]);
        updateState();
        socket?.sendMove(moveResult.san);
      }
    }
  }, [chess, previewIndex, updateState, socket, playingAs]);

  const promotion = useCallback((piece: 'q' | 'r' | 'n' | 'b') => {
    if (!pendingMove) return;
    const [from, to] = pendingMove;
    const moveResult = chess.move({ from, to, promotion: piece });
    
    if (moveResult) {
      setLastMove([from, to]);
      setSelectVisible(false);
      updateState();
      socket?.sendMove(moveResult.san);
    }
  }, [chess, pendingMove, updateState, socket]);

  const previewMove = useCallback((index: number) => {
    if (index >= chess.history().length) setPreviewIndex(null);
    else setPreviewIndex(index);
  }, [chess]);

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
    } else if (previewIndex !== null && previewIndex === chess.history().length - 1) {
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
    if (socket) {
      socket.connect(gameId, userId);
    }
  }, [gameId, userId, socket]);

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
    reconnect
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