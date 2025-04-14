'use client';

import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import GamePane from '@/components/GamePane';

export default function Game() {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [lastMove, setLastMove] = useState<[Square, Square] | undefined>();
  const [selectVisible, setSelectVisible] = useState(false);
  const [pendingMove, setPendingMove] = useState<[Square, Square] | undefined>();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const fullHistory = chess.history({ verbose: true });

  const updateState = useCallback(() => {
    setFen(chess.fen());
  }, [chess]);

  const onMove = useCallback((from: Square, to: Square) => {
    if (previewIndex !== null) {
      setPreviewIndex(null);
      return;
    }
    
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
  }, [chess, previewIndex, updateState]);

  const randomMove = useCallback(() => {
    const moves = chess.moves({ verbose: true });
    if (moves.length > 0 && !chess.isGameOver()) {
      const random = moves[Math.floor(Math.random() * moves.length)];
      chess.move(random);
      setLastMove([random.from as Square, random.to as Square]);
      updateState();
    }
  }, [chess, updateState]);

  const promotion = useCallback((piece: 'q' | 'r' | 'n' | 'b') => {
    if (!pendingMove) return;
    const [from, to] = pendingMove;
    chess.move({ from, to, promotion: piece });
    setLastMove([from, to]);
    setSelectVisible(false);
    updateState();
    setTimeout(randomMove, 500);
  }, [chess, pendingMove, randomMove, updateState]);

  const previewMove = useCallback((index: number) => {
    if (index >= fullHistory.length) setPreviewIndex(null);
    else setPreviewIndex(index);
  }, [fullHistory.length]);

  const handleFirstMove = useCallback(() => {
    if (fullHistory.length > 0) {
      setPreviewIndex(0);
    }
  }, [fullHistory.length]);

  const handlePrevious = useCallback(() => {
    if (previewIndex === null && fullHistory.length > 0) {
      setPreviewIndex(fullHistory.length - 1);
    } else if (previewIndex !== null && previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
    }
  }, [previewIndex, fullHistory.length]);

  const handleNext = useCallback(() => {
    if (previewIndex !== null && previewIndex < fullHistory.length - 1) {
      setPreviewIndex(previewIndex + 1);
    } else if (previewIndex !== null && previewIndex === fullHistory.length - 1) {
      setPreviewIndex(null);
    }
  }, [previewIndex, fullHistory.length]);

  const handleLastMove = useCallback(() => {
    setPreviewIndex(null);
  }, []);

  const calcPreviewFen = useCallback(() => {
    if (previewIndex === null) return null;
    const temp = new Chess();
    fullHistory.slice(0, previewIndex).forEach((m) => temp.move(m.san));
    return temp.fen();
  }, [previewIndex, fullHistory]);

  const gameProps = {
    chess,
    fen,
    lastMove,
    selectVisible,
    pendingMove,
    previewIndex,
    fullHistory,
    previewFen: calcPreviewFen(),
    onMove,
    promotion,
    previewMove,
    handleFirstMove,
    handlePrevious,
    handleNext,
    handleLastMove,
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <GamePane playingAs="w" gameProps={gameProps} />
    </div>
  );
}