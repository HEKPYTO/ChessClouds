'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MatchMakingService } from '@/lib/matchmakingService';

type MatchmakingContextType = {
  isMatchmaking: boolean;
  startMatchmaking: (userId: string) => Promise<void>;
  cancelMatchmaking: () => void;
  matchmakingError: string | null;
};

const MatchmakingContext = createContext<MatchmakingContextType | undefined>(undefined);

export function MatchmakingProvider({ children }: { children: ReactNode }) {
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [matchmakingError, setMatchmakingError] = useState<string | null>(null);

  const startMatchmaking = async (userId: string) => {
    if (isMatchmaking) return;
    
    try {
      setIsMatchmaking(true);
      setMatchmakingError(null);
      
      const matchmakingService = MatchMakingService.getInstance();
      const { game_id, color } = await matchmakingService.findMatch(userId);
      
      window.location.href = `/socket?game_id=${game_id}&playas=${color}`;
    } catch (error) {
      setMatchmakingError(error instanceof Error ? error.message : 'Match finding failed');
      setIsMatchmaking(false);
    }
  };

  const cancelMatchmaking = () => {
    const matchmakingService = MatchMakingService.getInstance();
    matchmakingService.cancelMatch();
    setIsMatchmaking(false);
  };

  return (
    <MatchmakingContext.Provider 
      value={{ isMatchmaking, startMatchmaking, cancelMatchmaking, matchmakingError }}
    >
      {children}
    </MatchmakingContext.Provider>
  );
}

export function useMatchmaking() {
  const context = useContext(MatchmakingContext);
  if (context === undefined) {
    throw new Error('useMatchmaking must be used within a MatchmakingProvider');
  }
  return context;
}