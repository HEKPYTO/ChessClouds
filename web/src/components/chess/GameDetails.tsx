"use client";

export interface GameDetailsProps {
  playerA: string;
  playerB: string;
  gameStatus: string;
}

export function GameDetails({ playerA, playerB, gameStatus }: GameDetailsProps) {
  return (
    <div className="w-full border p-4 flex flex-col items-center mb-4">
      <div className="font-bold text-lg">
        {playerA} - {playerB}
      </div>
      <div className="text-sm mt-2">
        {gameStatus}
      </div>
    </div>
  );
}