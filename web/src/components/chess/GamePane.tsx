'use client';

import { useState, useMemo, useEffect } from 'react';
import { Chess, type Move } from 'chess.js';
import type { Square } from 'chess.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChessBoard } from './ChessBoard';
import { MoveViewer, MovePair } from './MoveViewer';
import { GameDetails } from './GameDetails';

interface PaneProps {
  playingAs: 'w' | 'b';
}

function getGameStatus(chess: Chess): string {
  if (!chess.isGameOver()) return 'On Going';
  if (chess.isCheckmate()) {
    const winner = chess.turn() === 'w' ? 'Black' : 'White';
    return `Completed - ${winner} wins by checkmate`;
  }
  if (chess.isStalemate()) return 'Completed - Stalemate';
  if (chess.isDraw()) return 'Completed - Draw';
  return 'Completed';
}

export default function Pane({ playingAs }: PaneProps) {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [lastMove, setLastMove] = useState<[Square, Square] | undefined>();
  const [selectVisible, setSelectVisible] = useState(false);
  const [pendingMove, setPendingMove] = useState<
    [Square, Square] | undefined
  >();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleResetGame = () => {
    chess.reset();
    setFen(chess.fen());
    setLastMove(undefined);
    setPreviewIndex(null);
    if (playingAs === 'b' && chess.turn() !== 'b' && !chess.isGameOver()) {
      setTimeout(randomMove, 500);
    }
  };

  const handlePrevious = () => {
    if (fullHistory.length > 0) {
      setPreviewIndex(
        previewIndex === null
          ? fullHistory.length - 1
          : Math.max(previewIndex - 1, 0)
      );
    }
  };

  const handleNext = () => {
    if (previewIndex === null) return;
    if (previewIndex >= fullHistory.length - 1) setPreviewIndex(null);
    else setPreviewIndex(previewIndex + 1);
  };

  const handleForward = () => {
    setPreviewIndex(null);
  };

  const movePairs: MovePair[] = useMemo(() => {
    const pairs: MovePair[] = [];
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Interactive Chess</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
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
        <div className="w-full flex-1 flex flex-col items-center lg:items-start">
          <GameDetails
            playerA="Player A (1600)"
            playerB="Player B (1600)"
            gameStatus={gameStatus}
          />
          <MoveViewer
            movePairs={movePairs}
            previewIndex={previewIndex}
            previewMove={previewMove}
            handleResetGame={handleResetGame}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            handleForward={handleForward}
            fullHistoryLength={fullHistory.length}
          />
        </div>
      </CardContent>
    </Card>
  );
}
