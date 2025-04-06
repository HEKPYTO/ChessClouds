'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AnimationsContextType {
  animateMousePosition: (e: React.MouseEvent) => void;
  mouseX: number;
  mouseY: number;
}

const AnimationsContext = createContext<AnimationsContextType | undefined>(
  undefined
);

export function useAnimations() {
  const context = useContext(AnimationsContext);
  if (context === undefined) {
    throw new Error('useAnimations must be used within an AnimationsProvider');
  }
  return context;
}

export default function AnimationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const animateMousePosition = (e: React.MouseEvent) => {
    setMouseX(e.clientX / windowDimensions.width);
    setMouseY(e.clientY / windowDimensions.height);
  };

  return (
    <AnimationsContext.Provider
      value={{
        animateMousePosition,
        mouseX,
        mouseY,
      }}
    >
      {children}
    </AnimationsContext.Provider>
  );
}
