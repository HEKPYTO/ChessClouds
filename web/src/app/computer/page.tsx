'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import ComputerGamePane from '@/components/ComputerGamePane';
import LoadingScreen from '@/components/LoadingScreen';
import { toast } from 'sonner';
import { testEngine, getBestMove } from '@/lib/engine';

export default function ComputerGame() {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [lastMove, setLastMove] = useState<[Square, Square] | undefined>();
  const [selectVisible, setSelectVisible] = useState(false);
  const [pendingMove, setPendingMove] = useState<[Square, Square] | undefined>();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [playingAs, setPlayingAs] = useState<'w' | 'b'>('w');
  const [engineStatus, setEngineStatus] = useState<'connected' | 'degraded' | 'disconnected'>('disconnected');
  const [isThinking, setIsThinking] = useState(false);
  
  const moveHistory = useRef<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const color = params.get('color');
      if (color === 'w' || color === 'b') setPlayingAs(color);
    }
  }, []);

  useEffect(() => {
    const checkEngineConnection = async () => {
      try {
        setIsLoading(true);
        const response = await testEngine();
        if (response.status === 'success') {
          setEngineStatus('connected');
          setError(null);
        } else {
          setEngineStatus('degraded');
          setError('Engine connection degraded');
        }
      } catch (err) {
        setEngineStatus('disconnected');
        setError('Failed to connect to chess engine');
        toast.error('Engine connection failed', {
          description: 'Unable to connect to the chess engine'
        });
      } finally {
        setIsLoading(false);
        
        if (playingAs === 'b' && !gameOver) {
          makeComputerMove();
        }
      }
    };

    checkEngineConnection();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [playingAs]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const updateState = useCallback(() => {
    setFen(chess.fen());
    if (chess.isGameOver()) {
      setGameOver(true);
    } else {
      setGameOver(false);
    }
  }, [chess]);

  const makeComputerMove = useCallback(async () => {
    if (gameOver || chess.turn() === playingAs || isThinking) return;

    setIsThinking(true);
    try {
      const response = await getBestMove(chess.fen());
      const { best_move } = response;
      
      if (best_move) {
        const from = best_move.substring(0, 2) as Square;
        const to = best_move.substring(2, 4) as Square;
        const promotion = best_move.length > 4 ? best_move.substring(4, 5) : undefined;
        
        const moveResult = chess.move({ from, to, promotion });
        if (moveResult) {
          setLastMove([from, to]);
          moveHistory.current.push(moveResult.san);
          updateState();
        }
      }
    } catch (err) {
      setEngineStatus('degraded');
      toast.error('Engine move failed', {
        description: 'Could not get best move from engine'
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
      
      if (chess.turn() !== playingAs || gameOver || isThinking) {
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
          moveHistory.current.push(moveResult.san);
          updateState();
          
          timeoutRef.current = setTimeout(() => {
            makeComputerMove();
          }, 500);
        }
      }
    },
    [chess, previewIndex, updateState, playingAs, gameOver, isThinking, makeComputerMove]
  );

  const promotion = useCallback(
    (piece: 'q' | 'r' | 'n' | 'b') => {
      if (!pendingMove) return;
      const [from, to] = pendingMove;
      const moveResult = chess.move({ from, to, promotion: piece });
      
      if (moveResult) {
        setLastMove([from, to]);
        moveHistory.current.push(moveResult.san);
        setSelectVisible(false);
        updateState();
        
        timeoutRef.current = setTimeout(() => {
          makeComputerMove();
        }, 500);
      }
    },
    [chess, pendingMove, updateState, makeComputerMove]
  );

  const previewMove = useCallback(
    (index: number) => {
      if (index >= moveHistory.current.length) setPreviewIndex(null);
      else setPreviewIndex(index);
    },
    []
  );

  const handleFirstMove = useCallback(() => {
    if (moveHistory.current.length > 0) {
      setPreviewIndex(0);
    }
  }, []);

  const handlePrevious = useCallback(() => {
    if (previewIndex === null && moveHistory.current.length > 0) {
      setPreviewIndex(moveHistory.current.length - 1);
    } else if (previewIndex !== null && previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
    }
  }, [previewIndex]);

  const handleNext = useCallback(() => {
    if (previewIndex !== null && previewIndex < moveHistory.current.length - 1) {
      setPreviewIndex(previewIndex + 1);
    } else if (
      previewIndex !== null &&
      previewIndex === moveHistory.current.length - 1
    ) {
      setPreviewIndex(null);
    }
  }, [previewIndex]);

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

  const handleTakeBack = useCallback(() => {
    if (gameOver || moveHistory.current.length < 2) return;
    
    chess.undo(); // Undo computer's move
    chess.undo(); // Undo player's move
    
    moveHistory.current.pop(); // Remove computer's move from history
    moveHistory.current.pop(); // Remove player's move from history
    
    const moves = chess.history({ verbose: true });
    if (moves.length > 0) {
      const lastMove = moves[moves.length - 1];
      setLastMove([lastMove.from as Square, lastMove.to as Square]);
    } else {
      setLastMove(undefined);
    }
    
    updateState();
  }, [chess, gameOver, updateState]);

  const handleResign = useCallback(() => {
    if (gameOver) return;
    
    setGameOver(true);
    toast.info('Game ended', {
      description: 'You resigned the game'
    });
  }, [gameOver]);

  const handleRetry = useCallback(() => {
    if (engineStatus !== 'disconnected') return;
    
    setIsLoading(true);
    testEngine()
      .then(response => {
        if (response.status === 'success') {
          setEngineStatus('connected');
          setError(null);
          toast.success('Engine connection restored');
        } else {
          setEngineStatus('degraded');
          setError('Engine connection degraded');
          toast.warning('Engine connection degraded');
        }
      })
      .catch(err => {
        setEngineStatus('disconnected');
        setError('Failed to connect to chess engine');
        toast.error('Engine connection failed');
      })
      .finally(() => {
        setIsLoading(false);
      });
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
    handleRetry
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <ComputerGamePane playingAs={playingAs} gameProps={gameProps} />
    </div>
  );
}