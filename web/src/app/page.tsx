'use client';

import { useState, useEffect } from 'react';
import CustomChessBoard from '@/components/DisplayChessBoard';
import ChessNotations from '@/components/ChessNotations';
import { Button } from '@/components/ui/button';
import {
  ChevronRightIcon,
  PlayIcon,
  DocumentDuplicateIcon,
  BoltIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMatchmaking } from '@/lib/MatchmakingContext';
import { getUserInfo, isAuthenticated } from '@/lib/auth/googleAuth';

export default function HomePage() {
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const router = useRouter();
  
  const { 
    isMatchmaking, 
    startMatchmaking, 
    cancelMatchmaking, 
    playCooldownState,
    cooldownRemaining 
  } = useMatchmaking();
  
  const userInfo = getUserInfo();
  const username = userInfo?.email?.split('@')[0] || 'anonymous';
  const authenticated = isAuthenticated();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      
      if (pressedKey !== null) return;
      
      if (e.key.toLowerCase() === 'p') {
        setPressedKey('p');
        
        handlePlayNow();
      } else if (e.key.toLowerCase() === 's') {
        setPressedKey('s');
        setTimeout(() => {
          router.push('/signup');
          setPressedKey(null);
        }, 150);
      }
    };

    const handleKeyUp = () => {
      
      if (pressedKey !== null) {
        setTimeout(() => setPressedKey(null), 50);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [router, pressedKey, isMatchmaking, playCooldownState]);

  const handleSignUp = () => {
    setPressedKey('s');
    setTimeout(() => {
      router.push('/signup');
      setPressedKey(null);
    }, 150);
  };

  const handleLearnMore = () => {
    router.push('/learn');
  };

  const handlePlayNow = () => {
    
    if (pressedKey === 'p') return;
    
    setPressedKey('p');
    
    if (playCooldownState === 'cooldown' && !isMatchmaking) {
      toast.info(`Please wait ${Math.ceil(cooldownRemaining/1000)} seconds before trying again`);
      setTimeout(() => setPressedKey(null), 150);
      return;
    }
    
    if (isMatchmaking) {
      cancelMatchmaking();
      toast.info('Matchmaking canceled');
      setTimeout(() => setPressedKey(null), 150);
      return;
    }
    
    if (!authenticated) {
      setTimeout(() => {
        router.push('/signin');
        setPressedKey(null);
      }, 150);
      return;
    }
    
    
    startMatchmaking(username);
    toast.success('Finding a match...', {
      description: 'We\'ll connect you with an opponent soon'
    });
    setTimeout(() => setPressedKey(null), 150);
  };

  const pgn = '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. O-O Nf6 5. d3 d6';

  return (
    <>
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/70 to-amber-100/50 dark:from-slate-900/70 dark:to-slate-800/50">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/noise.png)',
              backgroundRepeat: 'repeat',
              opacity: 0.025,
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-amber-900 dark:text-amber-100 max-w-4xl mx-auto leading-tight font-display">
            The definition of modern chess platform
          </h1>
          <p className="mt-6 text-lg text-amber-800 dark:text-amber-200 max-w-2xl mx-auto">
            ChessClouds is a next-generation chess platform designed for
            high-performance gameplay with players worldwide.
          </p>

          <div className="mt-10 flex justify-center space-x-4">
            <Button
              className={`h-12 bg-amber-600 hover:bg-amber-700 text-white px-6 rounded-md transition-all 
              shadow-[0_4px_0_0_#b45309] hover:shadow-[0_2px_0_0_#92400e] hover:translate-y-[2px] 
              dark:bg-amber-500 dark:hover:bg-amber-600
              dark:shadow-[0_4px_0_0_#92400e] dark:hover:shadow-[0_2px_0_0_#78350f]
              ${
                pressedKey === 'p'
                  ? 'transform translate-y-[4px] shadow-none bg-amber-700 dark:bg-amber-600'
                  : ''
              }`}
              onClick={handlePlayNow}
              disabled={playCooldownState === 'cooldown' && !isMatchmaking}
            >
              {isMatchmaking ? (
                <>
                  Finding
                  <span className="inline-flex ml-1">
                    <span className="animate-bounce mx-0.5" style={{animationDelay: '0ms'}}>.</span>
                    <span className="animate-bounce mx-0.5" style={{animationDelay: '150ms'}}>.</span>
                    <span className="animate-bounce mx-0.5" style={{animationDelay: '300ms'}}>.</span>
                  </span>
                  <span
                    className={`ml-1 text-xs px-1 rounded transition-colors ${
                      pressedKey === 'p'
                        ? 'bg-amber-800 dark:bg-amber-700'
                        : 'bg-amber-700 dark:bg-amber-600'
                    }`}
                  >
                    P
                  </span>
                </>
              ) : playCooldownState === 'cooldown' ? (
                <>Wait {Math.ceil(cooldownRemaining/1000)}s</>
              ) : (
                <>
                  <PlayIcon className="mr-2 h-5 w-5" /> Play now
                  <span
                    className={`ml-1 text-xs px-1 rounded transition-colors ${
                      pressedKey === 'p'
                        ? 'bg-amber-800 dark:bg-amber-700'
                        : 'bg-amber-700 dark:bg-amber-600'
                    }`}
                  >
                    P
                  </span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className={`h-12 border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 px-6 rounded-md transition-all 
              shadow-[0_4px_0_0_#fcd34d] hover:shadow-[0_2px_0_0_#fcd34d] hover:translate-y-[2px]
              dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
              dark:shadow-[0_4px_0_0_#475569] dark:hover:shadow-[0_2px_0_0_#475569]
              ${
                pressedKey === 's'
                  ? 'transform translate-y-[4px] shadow-none bg-amber-100 dark:bg-slate-800'
                  : ''
              }`}
              onClick={handleSignUp}
            >
              <DocumentDuplicateIcon className="mr-2 h-5 w-5" /> Sign up
              <span
                className={`ml-1 text-xs px-1 rounded transition-colors ${
                  pressedKey === 's'
                    ? 'bg-amber-200 text-amber-900 dark:bg-slate-700 dark:text-amber-100'
                    : 'bg-amber-100 dark:bg-slate-800'
                }`}
              >
                S
              </span>
            </Button>
          </div>

          <div className="mt-6 flex justify-center items-center text-sm text-amber-700 dark:text-amber-300">
            <span className="flex items-center">
              <svg
                className="h-4 w-4 mr-1.5 text-amber-600 dark:text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Available for Web, iOS, and Android
            </span>
          </div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 p-8 rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-700/50 flex items-center justify-center text-amber-600 dark:text-amber-300 mr-3">
                  <BoltIcon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100">
                  Fast
                </h3>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                Written from scratch to efficiently leverage multiple CPU cores
                and your GPU for lightning-fast gameplay analysis.
              </p>
            </div>

            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 p-8 rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-700/50 flex items-center justify-center text-amber-600 dark:text-amber-300 mr-3">
                  <SparklesIcon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100">
                  Intelligent
                </h3>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                Integrate multiple chess engines into your workflow to generate,
                transform, and analyze strategies.
              </p>
            </div>

            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 p-8 rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-700/50 flex items-center justify-center text-amber-600 dark:text-amber-300 mr-3">
                  <UserGroupIcon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100">
                  Collaborative
                </h3>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                Chat with teammates, analyze games together, and share your
                strategies and projects. All included.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-100 font-display text-center mb-8">
            Experience Chess in a New Way
          </h2>
          <div className="bg-amber-50 dark:bg-slate-800 backdrop-blur-sm border border-amber-200/40 dark:border-amber-800/30 p-8 rounded-lg shadow-lg relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="order-2 md:order-1">
                <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4 font-display">
                  Ready for your next move?
                </h2>
                <p className="text-amber-800 dark:text-amber-200 mb-6">
                  Join thousands of players already experiencing the next
                  generation of online chess. Get started today and elevate your
                  game.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Button
                    className={`bg-amber-600 hover:bg-amber-700 text-white transition-all 
                    shadow-[0_4px_0_0_#b45309] hover:shadow-[0_2px_0_0_#92400e] hover:translate-y-[2px]
                    dark:bg-amber-500 dark:hover:bg-amber-600
                    dark:shadow-[0_4px_0_0_#92400e] dark:hover:shadow-[0_2px_0_0_#78350f]
                    ${
                      pressedKey === 's'
                        ? 'transform translate-y-[4px] shadow-none bg-amber-700 dark:bg-amber-600'
                        : ''
                    }`}
                    onClick={handleSignUp}
                  >
                    Sign up free
                    <ChevronRightIcon className="ml-2 h-4 w-4" />
                    <span
                      className={`ml-1 text-xs px-1 rounded transition-colors ${
                        pressedKey === 's'
                          ? 'bg-amber-800 dark:bg-amber-700'
                          : 'bg-amber-700 dark:bg-amber-600'
                      }`}
                    >
                      S
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900
                    shadow-[0_4px_0_0_#fcd34d] hover:shadow-[0_2px_0_0_#fcd34d] hover:translate-y-[2px]
                    dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-700/50
                    dark:shadow-[0_4px_0_0_#475569] dark:hover:shadow-[0_2px_0_0_#475569]"
                    onClick={handleLearnMore}
                  >
                    Learn more
                  </Button>
                </div>

                <div className="hidden md:block">
                  <ChessNotations pgn={pgn} />
                </div>
              </div>
              <div className="relative flex items-center justify-center order-1 md:order-2">
                <div className="w-full">
                  <CustomChessBoard
                    className="shadow-xl dark:shadow-amber-900/20"
                    pgn={pgn}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}