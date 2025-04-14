'use client';

import GamePane from '@/components/GamePane';

export default function Game() {
  return (
    <div className="container mx-auto py-8 px-4">
      <GamePane playingAs="w" />
    </div>
  );
}
