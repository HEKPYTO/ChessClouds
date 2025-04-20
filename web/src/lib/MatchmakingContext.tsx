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
import { toast } from 'sonner';

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

const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAY = 2000;
const COOLDOWN_DURATION = 5000;

export function MatchmakingProvider({ children }: { children: ReactNode }) {
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [matchmakingError, setMatchmakingError] = useState<string | null>(null);
  const [playCooldownState, setPlayCooldownState] =
    useState<CooldownState>('ready');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const cooldownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownStartTimeRef = useRef<number>(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownDuration = COOLDOWN_DURATION;

  const isCancelledRef = useRef(false);

  useEffect(() => {
    return () => {
      if (cooldownTimeoutRef.current) {
        clearTimeout(cooldownTimeoutRef.current);
      }
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
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

  const attemptMatchmaking = async (
    userId: string
  ): Promise<{ game_id: string; color: 'w' | 'b' }> => {
    try {
      const matchmakingService = MatchMakingService.getInstance();
      return await matchmakingService.findMatch(userId);
    } catch (error) {
      const isNetworkError =
        error instanceof Error &&
        (error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.message.includes('timeout'));

      if (isNetworkError && retryCount < MAX_RETRY_ATTEMPTS) {
        setRetryCount((prev) => prev + 1);
        throw error;
      }

      throw error;
    }
  };

  const startMatchmaking = async (userId: string) => {
    if (isMatchmaking) return;

    if (playCooldownState === 'cooldown') {
      return;
    }

    isCancelledRef.current = false

    try {
      setPlayCooldownState('active');
      setIsMatchmaking(true);
      setMatchmakingError(null);
      setRetryCount(0);

      let result;
      try {
        result = await attemptMatchmaking(userId);
      } catch (error) {
        if (isCancelledRef.current) {
          return
        }
        if (retryCount < MAX_RETRY_ATTEMPTS) {
          toast.info(
            `Connection issue. Retrying... (${
              retryCount + 1
            }/${MAX_RETRY_ATTEMPTS})`
          );

          await new Promise((resolve) => {
            retryTimeoutRef.current = setTimeout(() => {
              resolve(null);
            }, RETRY_DELAY * Math.pow(2, retryCount));
          });

          result = await attemptMatchmaking(userId);
        } else {
          throw error;
        }
      }

      window.location.href = `/socket?game_id=${result.game_id}&playas=${result.color}`;
    } catch (error) {
      if (error instanceof Error && !error.message.includes('canceled')) {
        setMatchmakingError(
          error instanceof Error ? error.message : 'Match finding failed'
        );
        startCooldown();
      }

      setIsMatchmaking(false);
    }
  };

  const cancelMatchmaking = () => {
    const matchmakingService = MatchMakingService.getInstance();
    isCancelledRef.current = true
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
