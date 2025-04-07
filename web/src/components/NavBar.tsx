'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ThemeSwitch from './ThemeSwitch';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'p') {
        setPressedKey('p');
        setTimeout(() => {
          window.location.href = '/play';
        }, 150);
      } else if (e.key.toLowerCase() === 's') {
        setPressedKey('s');
        setTimeout(() => {
          window.location.href = '/signup';
        }, 150);
      }
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handlePlayClick = () => {
    setPressedKey('p');
    setTimeout(() => {
      window.location.href = '/play';
    }, 150);
  };

  const handleSignUpClick = () => {
    setPressedKey('s');
    setTimeout(() => {
      window.location.href = '/signup';
    }, 150);
  };

  const handleNavClick = (path: string) => {
    window.location.href = path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-200 ${
        scrolled
          ? 'border-amber-200/20 bg-amber-50/80 backdrop-blur-md dark:border-slate-700/20 dark:bg-slate-900/80'
          : 'border-amber-200/10 bg-amber-50/90 dark:border-slate-700/10 dark:bg-slate-900/90'
      }`}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/noise.png)',
          backgroundRepeat: 'repeat',
          opacity: 0.025,
          pointerEvents: 'none',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center cursor-pointer"
          >
            <div className="h-8 w-8 rounded bg-amber-600 dark:bg-amber-500 mr-2"></div>
            <span className="font-semibold text-lg text-amber-900 dark:text-amber-100 ml-2">
              ChessCloud
            </span>
          </button>

          <nav className="hidden md:flex ml-10 space-x-8">
            <button
              onClick={() => handleNavClick('/features')}
              className="text-sm text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50 cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('/tournaments')}
              className="text-sm text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50 cursor-pointer"
            >
              Tournaments
            </button>
            <button
              onClick={() => handleNavClick('/docs')}
              className="text-sm text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50 cursor-pointer"
            >
              Docs
            </button>
            <button
              onClick={() => handleNavClick('/blog')}
              className="text-sm text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50 cursor-pointer"
            >
              Blog
            </button>
            <div className="relative group">
              <button className="text-sm text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50 flex items-center cursor-pointer">
                Resources
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeSwitch />

          <Button
            variant="outline"
            className={`h-9 text-sm border-amber-300 text-amber-800 hover:bg-amber-100/50 transition-all 
            shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[2px]
            dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
            dark:shadow-[0_3px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]
            ${
              pressedKey === 's'
                ? 'transform translate-y-[3px] shadow-none bg-amber-100 dark:bg-slate-800'
                : ''
            }`}
            onClick={handleSignUpClick}
          >
            Sign up
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

          <Button
            className={`h-9 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-md transition-all 
            shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[2px]
            dark:bg-amber-500 dark:hover:bg-amber-600
            dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]
            ${
              pressedKey === 'p'
                ? 'transform translate-y-[3px] shadow-none bg-amber-700 dark:bg-amber-600'
                : ''
            }`}
            onClick={handlePlayClick}
          >
            Play now
            <span
              className={`ml-1 text-xs px-1 rounded transition-colors ${
                pressedKey === 'p'
                  ? 'bg-amber-800 dark:bg-amber-700'
                  : 'bg-amber-700 dark:bg-amber-600'
              }`}
            >
              P
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
