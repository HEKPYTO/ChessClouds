'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  HomeIcon,
  ArrowPathIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import CustomChessBoard from '@/components/DisplayChessBoard';

export default function NotFound() {
  const [chessAnimation, setChessAnimation] = useState(0);
  const animations = [
    '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Bc4',
    '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5',
    '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setChessAnimation((prev) => (prev + 1) % animations.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [animations.length]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-amber-50 via-amber-100/70 to-amber-200/50 dark:from-slate-800 dark:via-amber-900/20 dark:to-slate-900/90">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/noise.png)',
          backgroundRepeat: 'repeat',
          opacity: 0.025,
        }}
      />
      <div
        className="
          absolute inset-0 pointer-events-none
          [background-image:linear-gradient(90deg,rgba(241,194,125,0.15)_1px,transparent_1px),linear-gradient(180deg,rgba(241,194,125,0.15)_1px,transparent_1px)]
          dark:[background-image:linear-gradient(90deg,rgba(251,191,36,0.2)_1px,transparent_1px),linear-gradient(180deg,rgba(251,191,36,0.2)_1px,transparent_1px)]
          [background-size:20px_20px]
        "
      />

      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-amber-200/20 dark:bg-amber-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-amber-300/20 dark:bg-amber-600/15 rounded-full blur-3xl"></div>

      <div className="w-full max-w-5xl z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 p-6">
            <div className="mb-2 text-lg text-amber-600 dark:text-amber-400 font-medium">
              Error 404
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 dark:text-amber-100 font-display mb-6">
              Missing Piece
            </h1>
            <p className="text-amber-800 dark:text-amber-200 mb-8">
              The page you`&apos;`re looking for has moved, been captured, or
              never existed. Like a forgotten chess piece, it`&apos;`s no longer
              on the board.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => (window.location.href = '/')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 rounded-md 
                shadow-[0_4px_0_0_#b45309] hover:shadow-[0_2px_0_0_#92400e] hover:translate-y-[2px]
                dark:bg-amber-500 dark:hover:bg-amber-600
                dark:shadow-[0_4px_0_0_#92400e] dark:hover:shadow-[0_2px_0_0_#78350f]"
              >
                <HomeIcon className="mr-2 h-5 w-5" />
                Return Home
              </Button>

              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900
                shadow-[0_4px_0_0_#fcd34d] hover:shadow-[0_2px_0_0_#fcd34d] hover:translate-y-[2px]
                dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
                dark:shadow-[0_4px_0_0_#475569] dark:hover:shadow-[0_2px_0_0_#475569]"
              >
                <ArrowPathIcon className="mr-2 h-5 w-5" />
                Go Back
              </Button>
            </div>

            <div className="mt-12">
              <div className="text-sm text-amber-700 dark:text-amber-300">
                Looking for something specific?
              </div>
              <div className="mt-2 flex gap-6">
                <Link
                  href="/game"
                  className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 flex items-center text-sm"
                >
                  Play Game
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Link>
                <Link
                  href="/home"
                  className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 flex items-center text-sm"
                >
                  Dashboard
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 p-6 flex justify-center">
            <div className="w-full max-w-sm relative">
              <div className="absolute z-1 -top-8 -left-8 md:-top-14 md:-left-14 w-20 h-20 md:w-32 md:h-32 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center">
                <div className="text-6xl md:text-8xl font-bold text-amber-300 dark:text-amber-600 font-display">
                  ?
                </div>
              </div>
              <div className="chess-board-container">
                <CustomChessBoard
                  className="shadow-2xl dark:shadow-black/30"
                  pgn={animations[chessAnimation]}
                />
              </div>
              <div className="absolute -bottom-8 -right-8 md:-bottom-12 md:-right-12 w-20 h-20 md:w-32 md:h-32 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center">
                <div className="text-6xl md:text-8xl font-bold text-amber-300 dark:text-amber-600 font-display">
                  4
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
