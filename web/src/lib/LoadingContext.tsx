// src/lib/LoadingContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

type LoadingContextType = {
  setLoading: (isLoading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ setLoading: setIsLoading }}>
      {isLoading && <LoadingScreen />}
      <div className={isLoading ? 'opacity-0' : 'opacity-100'}>{children}</div>
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
