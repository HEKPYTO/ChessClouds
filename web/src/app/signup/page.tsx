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

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    
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
      } else if (e.key.toLowerCase() === 'h') {
        setPressedButton('home');
        setTimeout(() => {
          window.location.href = '/';
        }, 150);
      } else if (e.key.toLowerCase() === 't') {
        setPressedButton('theme');
        setTimeout(() => {
          toggleTheme();
          setPressedButton(null);
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

  const handleSignUpWithGoogle = () => {
    setPressedButton('google');
    setIsLoading(true);

    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  const handleSignUpWithApple = () => {
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
    <div className="min-h-screen flex flex-col text-slate-800 dark:text-amber-50 bg-amber-50 dark:bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-amber-50 dark:bg-slate-900">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/noise.png)',
            backgroundRepeat: 'repeat',
            opacity: 0.03,
          }}
        />
        <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] grid-rows-[repeat(40,minmax(0,1fr))]">
          {Array(1600)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="border-[0.5px] border-amber-800/5 dark:border-amber-200/5"
              />
            ))}
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-xl">
          <CardHeader className="space-y-1 text-center pb-1 pt-6">
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="outline"
                className={`h-9 w-9 p-0 rounded-md border-amber-300 text-amber-800 hover:bg-amber-100/50
                shadow-[0_4px_0_0_#fcd34d] hover:shadow-[0_2px_0_0_#fcd34d] hover:translate-y-[2px]
                dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
                dark:shadow-[0_4px_0_0_#475569] dark:hover:shadow-[0_2px_0_0_#475569]
                ${
                  pressedButton === 'home'
                    ? 'transform translate-y-[3px] shadow-none bg-amber-100 dark:bg-slate-800'
                    : ''
                }`}
                onClick={() => {
                  setPressedButton('home');
                  setTimeout(() => window.location.href = '/', 150);
                }}
              >
                <HomeIcon className="h-5 w-5" />
              </Button>
              
              <div className="h-12 w-12 rounded bg-amber-600 dark:bg-amber-500"></div>
              
              <Button
                variant="outline"
                className={`h-9 w-9 p-0 rounded-md border-amber-300 text-amber-800 hover:bg-amber-100/50
                shadow-[0_4px_0_0_#fcd34d] hover:shadow-[0_2px_0_0_#fcd34d] hover:translate-y-[2px]
                dark:bg-slate-800/70 dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
                dark:shadow-[0_4px_0_0_#475569] dark:hover:shadow-[0_2px_0_0_#475569]
                ${
                  pressedButton === 'theme'
                    ? 'transform translate-y-[3px] shadow-none bg-amber-100 dark:bg-slate-800'
                    : ''
                }`}
                onClick={() => {
                  setPressedButton('theme');
                  setTimeout(() => {
                    toggleTheme();
                    setPressedButton(null);
                  }, 150);
                }}
              >
                {theme === 'light' ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            <CardTitle className="text-2xl font-bold text-amber-900 dark:text-amber-100 font-display">
              Join ChessCloud
            </CardTitle>
            <CardDescription className="text-amber-700 dark:text-amber-300">
              Create your account to start playing
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
              onClick={handleSignUpWithGoogle}
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
                ? 'Creating account...'
                : 'Sign up with Google'}
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
              onClick={handleSignUpWithApple}
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

            <div className="text-xs text-center text-amber-600 dark:text-amber-400">
              By signing up, you agree to our{' '}
              <Link href="#" className="underline underline-offset-2">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="underline underline-offset-2">
                Privacy Policy
              </Link>
            </div>
          </CardContent>
          <Separator className="my-1 bg-amber-200/30 dark:bg-amber-700/20" />
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <div className="text-center text-sm text-amber-700 dark:text-amber-300">
              Already have an account?{' '}
              <Link
                href="/signin"
                className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}