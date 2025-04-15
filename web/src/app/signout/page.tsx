'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HomeIcon } from '@heroicons/react/24/outline';
import ThemeSwitch from '@/components/ThemeSwitch';
import { signOut } from '@/lib/auth/googleAuth';

export default function SignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h') {
        setPressedButton('home');
        setTimeout(() => {
          window.location.href = '/';
        }, 150);
      } else if (e.key.toLowerCase() === 'c') {
        setPressedButton('cancel');
        setTimeout(() => {
          window.location.href = '/home';
        }, 150);
      }
    };

    const handleKeyUp = () => {
      setPressedButton(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isLoading && countdown === 0) {
      signOut();
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading, countdown]);

  const handleSignOut = () => {
    setPressedButton('signout');
    setIsLoading(true);
  };

  const handleCancel = () => {
    setPressedButton('cancel');
    setTimeout(() => {
      window.location.href = '/home';
    }, 150);
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-800 dark:text-amber-50 relative overflow-hidden bg-gradient-to-tr from-amber-50 via-amber-100/70 to-amber-200/50 dark:from-slate-800 dark:via-amber-900/20 dark:to-slate-900/90">
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

      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-200/20 dark:bg-amber-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-amber-300/20 dark:bg-amber-600/15 rounded-full blur-3xl"></div>

      <div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-amber-200/50 dark:border-amber-700/40 shadow-xl dark:shadow-amber-900/30">
          <CardHeader className="space-y-1 text-center pb-1 pt-6">
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="outline"
                className="h-9 w-9 p-0 rounded-md border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900
                shadow-[0_4px_0_0_#fcd34d] hover:shadow-[0_2px_0_0_#fcd34d] hover:translate-y-[2px]
                dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
                dark:shadow-[0_4px_0_0_#475569] dark:hover:shadow-[0_2px_0_0_#475569]"
                onClick={() => (window.location.href = '/')}
              >
                <HomeIcon className="h-5 w-5" />
              </Button>

              <div className="h-12 w-12 rounded bg-amber-600 dark:bg-amber-500 shadow-md dark:shadow-amber-600/20"></div>

              <ThemeSwitch />
            </div>

            <CardTitle className="text-2xl font-bold text-amber-900 dark:text-amber-100 font-display">
              Exit ChessClouds
            </CardTitle>
            <CardDescription className="text-amber-700 dark:text-amber-300">
              Are you sure you really want to sign out?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Button
              className={`w-full bg-amber-600 hover:bg-amber-700 text-white px-6 rounded-md transition-all 
              shadow-[0_4px_0_0_#b45309] hover:shadow-[0_2px_0_0_#92400e] hover:translate-y-[2px]
              dark:bg-amber-500 dark:hover:bg-amber-600
              dark:shadow-[0_4px_0_0_#92400e] dark:hover:shadow-[0_2px_0_0_#78350f]
              ${
                pressedButton === 'signout'
                  ? 'transform translate-y-[4px] shadow-none bg-amber-700 dark:bg-amber-600'
                  : ''
              }`}
              disabled={isLoading}
              onClick={handleSignOut}
            >
              {isLoading ? `Signing out in ${countdown}s...` : 'Sign out'}
            </Button>

            <Button
              variant="outline"
              className={`w-full border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 px-6 rounded-md transition-all 
              shadow-[0_4px_0_0_#fcd34d] hover:shadow-[0_2px_0_0_#fcd34d] hover:translate-y-[2px]
              dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
              dark:shadow-[0_4px_0_0_#475569] dark:hover:shadow-[0_2px_0_0_#475569]
              ${
                pressedButton === 'cancel'
                  ? 'transform translate-y-[4px] shadow-none bg-amber-100 dark:bg-slate-800'
                  : ''
              }`}
              disabled={isLoading}
              onClick={handleCancel}
            >
              Cancel
              <span
                className={`ml-1 text-xs px-1 rounded transition-colors ${
                  pressedButton === 'cancel'
                    ? 'bg-amber-200 text-amber-900 dark:bg-slate-700 dark:text-amber-100'
                    : 'bg-amber-100 dark:bg-slate-800'
                }`}
              >
                C
              </span>
            </Button>
          </CardContent>
          <Separator className="my-1 bg-amber-200/30 dark:bg-amber-700/20" />
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <div className="text-center text-sm text-amber-700 dark:text-amber-300">
              Want to stay signed in?{' '}
              <Link
                href="/home"
                className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium underline underline-offset-4"
              >
                Return to Home
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
