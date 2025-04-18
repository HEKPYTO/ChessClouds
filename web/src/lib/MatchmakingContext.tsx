'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from 'react';
import { MatchMakingService } from '@/lib/matchmakingService';

type CooldownState = 'ready' | 'cooldown' | 'active';

type MatchmakingContextType = {
  isMatchmaking: boolean;
  startMatchmaking: (userId: string) => Promise<void>;
  cancelMatchmaking: () => void;
  matchmakingError: string | null;
  playCooldownState: CooldownState;
  cooldownDuration: number;
  cooldownRemaining: number;
};

const MatchmakingContext = createContext<MatchmakingContextType | undefined>(
  undefined
);

export function MatchmakingProvider({ children }: { children: ReactNode }) {
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [matchmakingError, setMatchmakingError] = useState<string | null>(null);
  const [playCooldownState, setPlayCooldownState] =
    useState<CooldownState>('ready');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const cooldownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownStartTimeRef = useRef<number>(0);
  const cooldownDuration = 5000;

  useEffect(() => {
    return () => {
      if (cooldownTimeoutRef.current) {
        clearTimeout(cooldownTimeoutRef.current);
      }
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, []);

  const startCooldown = () => {
    setPlayCooldownState('cooldown');
    cooldownStartTimeRef.current = Date.now();
    setCooldownRemaining(cooldownDuration);

    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
    }

    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
    }

    cooldownIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - cooldownStartTimeRef.current;
      const remaining = Math.max(0, cooldownDuration - elapsed);
      setCooldownRemaining(remaining);

      if (remaining <= 0) {
        if (cooldownIntervalRef.current) {
          clearInterval(cooldownIntervalRef.current);
          cooldownIntervalRef.current = null;
        }
      }
    }, 100);

    cooldownTimeoutRef.current = setTimeout(() => {
      setPlayCooldownState('ready');
      cooldownTimeoutRef.current = null;

      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
        cooldownIntervalRef.current = null;
      }
    }, cooldownDuration);
  };

  const startMatchmaking = async (userId: string) => {
    if (isMatchmaking) return;

    if (playCooldownState === 'cooldown') {
      return;
    }

    try {
      setPlayCooldownState('active');
      setIsMatchmaking(true);
      setMatchmakingError(null);

      const matchmakingService = MatchMakingService.getInstance();
      const { game_id, color } = await matchmakingService.findMatch(userId);

      window.location.href = `/socket?game_id=${game_id}&playas=${color}`;
    } catch (error) {
      setMatchmakingError(
        error instanceof Error ? error.message : 'Match finding failed'
      );
      setIsMatchmaking(false);
      startCooldown();
    }
  };

  const cancelMatchmaking = () => {
    const matchmakingService = MatchMakingService.getInstance();
    matchmakingService.cancelMatch();
    setIsMatchmaking(false);
    startCooldown();
  };

  return (
    <MatchmakingContext.Provider
      value={{
        isMatchmaking,
        startMatchmaking,
        cancelMatchmaking,
        matchmakingError,
        playCooldownState,
        cooldownDuration,
        cooldownRemaining,
      }}
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
