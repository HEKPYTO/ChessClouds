'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ThemeSwitch from './ThemeSwitch';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { isAuthenticated } from '@/lib/auth/googleAuth';
import { useRouter } from 'next/navigation';

type NavItem = {
  name: string;
  href: string;
  hasChildren?: boolean;
};

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const navigationItems: NavItem[] = [
    { name: 'Features', href: '/features' },
    { name: 'Tournaments', href: '/tournaments' },
    { name: 'Docs', href: '/docs' },
    { name: 'Blog', href: '/blog' },
    { name: 'Resources', href: '/resources', hasChildren: true },
  ];

  useEffect(() => {
    setAuthenticated(isAuthenticated());

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'p') {
        setPressedKey('p');
        setTimeout(() => {
          router.push(isAuthenticated() ? '/play' : '/signin');
        }, 150);
      } else if (key === 'd' && authenticated) {
        // For authenticated users, the D key navigates to the dashboard.
        setPressedKey('d');
        setTimeout(() => {
          router.push('/dashboard');
        }, 150);
      } else if (key === 's' && !authenticated) {
        // For non-authenticated users, the S key navigates to sign up.
        setPressedKey('s');
        setTimeout(() => {
          router.push('/signup');
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
  }, [router, authenticated]);

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  const handlePlayClick = () => {
    setPressedKey('p');
    setTimeout(() => {
      router.push(authenticated ? '/play' : '/signin');
    }, 150);
  };

  // This handler will act as the click action for the sign up/dashboard button.
  const handleDashboardSignUpClick = () => {
    setPressedKey(authenticated ? 'd' : 's');
    setTimeout(() => {
      router.push(authenticated ? '/dashboard' : '/signup');
    }, 150);
  };

  const toggleMobileMenu = () => {
    setAnimating(true);
    if (mobileMenuOpen) {
      setTimeout(() => {
        setMobileMenuOpen(false);
        setAnimating(false);
      }, 300);
    } else {
      setMobileMenuOpen(true);
      setTimeout(() => {
        setAnimating(false);
      }, 50);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-200 ${
        scrolled
          ? 'border-amber-200/20 bg-amber-50/80 backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-900/80'
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
            onClick={() => handleNavClick(authenticated ? '/home' : '/')}
            className="flex items-center cursor-pointer"
          >
            <div className="h-8 w-8 rounded bg-amber-600 dark:bg-amber-500 mr-2"></div>
            <span className="font-semibold text-lg text-amber-900 dark:text-amber-100 ml-2">
              ChessClouds
            </span>
          </button>

          {/* Desktop navigation - only visible on xl screens */}
          <nav className="hidden xl:flex ml-10 space-x-8">
            {navigationItems.map((item) =>
              item.hasChildren ? (
                <div className="relative group" key={item.name}>
                  <button className="text-sm text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50 flex items-center cursor-pointer">
                    {item.name}
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
              ) : (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="text-sm text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50 cursor-pointer"
                >
                  {item.name}
                </button>
              )
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          {/* Theme Switcher - Always visible */}
          <ThemeSwitch />

          {/* Desktop button: Dashboard if authenticated, otherwise Sign up */}
          <div className="hidden md:block">
            <Button
              variant="outline"
              className={`h-9 text-sm border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 transition-all 
                shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[2px]
                dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50 dark:shadow-[0_3px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569] ${
                  pressedKey === (authenticated ? 'd' : 's')
                    ? 'transform translate-y-[3px] shadow-none bg-amber-100 dark:bg-slate-800'
                    : ''
                }`}
              onClick={handleDashboardSignUpClick}
            >
              {authenticated ? 'Dashboard' : 'Sign up'}
              <span
                className={`ml-1 text-xs px-1 rounded transition-colors ${
                  pressedKey === (authenticated ? 'd' : 's')
                    ? 'bg-amber-200 text-amber-900 dark:bg-slate-700 dark:text-amber-100'
                    : 'bg-amber-100 dark:bg-slate-800'
                }`}
              >
                {authenticated ? 'D' : 'S'}
              </span>
            </Button>
          </div>

          {/* Play now button - visible on small and up screens */}
          <div className="hidden sm:block">
            <Button
              className={`h-9 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-md transition-all 
                shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[2px]
                dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f] ${
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

          {/* Hamburger Menu Button - hidden on xl screens */}
          <button
            className="xl:hidden flex items-center justify-center h-9 w-9 p-0 border border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 rounded-md transition-all shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[2px] dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50 dark:shadow-[0_3px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]"
            onClick={toggleMobileMenu}
            disabled={animating}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 space-y-3 border-t border-amber-200/30 dark:border-slate-700/30 bg-amber-50/95 dark:bg-slate-900/95 backdrop-blur-sm">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.href)}
              className="block w-full text-left py-2 px-3 text-base text-amber-800 hover:bg-amber-100/70 hover:text-amber-950 dark:text-amber-200 dark:hover:bg-slate-800/70 dark:hover:text-amber-50 rounded-md flex items-center justify-between"
            >
              <span>{item.name}</span>
              {item.hasChildren && (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          ))}
          <div className="pt-2 border-t border-amber-200/30 dark:border-slate-700/30 flex flex-col gap-2">
            {/* Mobile Menu: Dashboard if authenticated, otherwise Sign up */}
            <div className="md:hidden">
              <Button
                variant="outline"
                className="w-full mt-2 border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[2px] dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50 dark:shadow-[0_3px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]"
                onClick={handleDashboardSignUpClick}
              >
                {authenticated ? 'Dashboard' : 'Sign up'}
                <span className="ml-1 text-xs px-1 rounded bg-amber-100 dark:bg-slate-800">
                  {authenticated ? 'D' : 'S'}
                </span>
              </Button>
            </div>

            {/* Mobile Menu: Play now button */}
            <div className="sm:hidden">
              <Button
                className="w-full mt-1 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-md shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e] hover:translate-y-[2px] dark:bg-amber-500 dark:hover:bg-amber-600 dark:shadow-[0_3px_0_0_#92400e] dark:hover:shadow-[0_1px_0_0_#78350f]"
                onClick={handlePlayClick}
              >
                Play now
                <span className="ml-1 text-xs px-1 rounded bg-amber-700 dark:bg-amber-600">
                  P
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
