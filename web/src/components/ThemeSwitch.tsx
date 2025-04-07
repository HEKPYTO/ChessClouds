'use client';

import { useState, useEffect } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Button } from './ui/button';

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const [pressedKey, setPressedKey] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    setPressedKey(true);
    setTimeout(() => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      localStorage.setItem('theme', newTheme);
      setPressedKey(false);
    }, 150);
  };

  if (!mounted) {
    return;
  }

  return (
    <Button
      variant="outline"
      className={`h-9 w-9 p-0 flex items-center justify-center border-amber-300 text-amber-800 
      hover:bg-amber-100/50 rounded-md transition-all 
      shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[2px]
      dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50
      dark:shadow-[0_3px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]
      ${
        pressedKey
          ? 'transform translate-y-[3px] shadow-none bg-amber-100 dark:bg-slate-800'
          : ''
      }`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </Button>
  );
}
