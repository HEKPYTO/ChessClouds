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
import Image from 'next/image';
import { HomeIcon } from '@heroicons/react/24/outline';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'g') {
        setPressedButton('google');
        setTimeout(() => {
          window.location.href = '/';
        }, 150);
      } else if (e.key.toLowerCase() === 'a') {
        setPressedButton('apple');
        setTimeout(() => {
          window.location.href = '/';
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

  const handleSignInWithGoogle = () => {
    setPressedButton('google');
    setIsLoading(true);

    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  const handleSignInWithApple = () => {
    setPressedButton('apple');
    setIsLoading(true);

    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-800 dark:text-amber-50 relative overflow-hidden bg-gradient-to-br from-amber-50 via-amber-100/70 to-amber-200/50 dark:from-slate-800 dark:via-amber-900/20 dark:to-slate-900/90 animate-[gradient_15s_ease_infinite]">
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

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-200/20 dark:bg-amber-500/20 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-amber-300/20 dark:bg-amber-600/15 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite_reverse]"></div>

      <div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-amber-200/50 dark:border-amber-700/40 shadow-xl dark:shadow-amber-900/30">
          <CardHeader className="space-y-1 text-center pb-1 pt-6">
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="outline"
                className="h-9 w-9 p-0 rounded-md border-amber-300 text-amber-800 hover:bg-amber-100/50
                shadow-[0_4px_0_0_#fcd34d] hover:shadow-[0_2px_0_0_#fcd34d] hover:translate-y-[2px]
                dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
                dark:shadow-[0_4px_0_0_#475569] dark:hover:shadow-[0_2px_0_0_#475569]"
                onClick={() => (window.location.href = '/')}
              >
                <HomeIcon className="h-5 w-5" />
              </Button>

              <div className="h-12 w-12 rounded bg-amber-600 dark:bg-amber-500 shadow-md dark:shadow-amber-600/20"></div>

              <Button
                variant="outline"
                className="h-9 w-9 p-0 rounded-md border-amber-300 text-amber-800 hover:bg-amber-100/50
                shadow-[0_4px_0_0_#fcd34d] hover:shadow-[0_2px_0_0_#fcd34d] hover:translate-y-[2px]
                dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
                dark:shadow-[0_4px_0_0_#475569] dark:hover:shadow-[0_2px_0_0_#475569]"
                onClick={toggleTheme}
              >
                {theme === 'light' ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                )}
              </Button>
            </div>

            <CardTitle className="text-2xl font-bold text-amber-900 dark:text-amber-100 font-display">
              Sign in to ChessClouds
            </CardTitle>
            <CardDescription className="text-amber-700 dark:text-amber-300">
              Continue with your preferred account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className={`w-full border-amber-300 text-amber-800 hover:bg-amber-100/50 px-6 rounded-md transition-all 
              shadow-[0_4px_0_0_#fcd34d] hover:shadow-[0_2px_0_0_#fcd34d] hover:translate-y-[2px]
              dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
              dark:shadow-[0_4px_0_0_#475569] dark:hover:shadow-[0_2px_0_0_#475569]
              ${
                pressedButton === 'google'
                  ? 'transform translate-y-[3px] shadow-none bg-amber-100 dark:bg-slate-800'
                  : ''
              }`}
              disabled={isLoading}
              onClick={handleSignInWithGoogle}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {isLoading && pressedButton === 'google'
                ? 'Signing in...'
                : 'Continue with Google'}
              <span
                className={`ml-1 text-xs px-1 rounded transition-colors ${
                  pressedButton === 'google'
                    ? 'bg-amber-200 text-amber-900 dark:bg-slate-700 dark:text-amber-100'
                    : 'bg-amber-100 dark:bg-slate-800'
                }`}
              >
                G
              </span>
            </Button>

            <Button
              variant="outline"
              className={`w-full border-amber-300 text-amber-800 hover:bg-amber-100/50 px-6 rounded-md transition-all 
              shadow-[0_4px_0_0_#fcd34d] hover:shadow-[0_2px_0_0_#fcd34d] hover:translate-y-[2px]
              dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
              dark:shadow-[0_4px_0_0_#475569] dark:hover:shadow-[0_2px_0_0_#475569]
              ${
                pressedButton === 'apple'
                  ? 'transform translate-y-[3px] shadow-none bg-amber-100 dark:bg-slate-800'
                  : ''
              }`}
              disabled={isLoading}
              onClick={handleSignInWithApple}
            >
              <Image
                src="/apple.svg"
                alt="Apple icon"
                width={20}
                height={20}
                className="w-5 h-5 mr-2"
              />
              {isLoading && pressedButton === 'apple'
                ? 'Creating account...'
                : 'Sign up with Apple'}
              <span
                className={`ml-1 text-xs px-1 rounded transition-colors ${
                  pressedButton === 'apple'
                    ? 'bg-amber-200 text-amber-900 dark:bg-slate-700 dark:text-amber-100'
                    : 'bg-amber-100 dark:bg-slate-800'
                }`}
              >
                A
              </span>
            </Button>
          </CardContent>
          <Separator className="my-1 bg-amber-200/30 dark:bg-amber-700/20" />
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <div className="text-center text-sm text-amber-700 dark:text-amber-300">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
