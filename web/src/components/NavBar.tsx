'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ThemeSwitch from './ThemeSwitch';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { isAuthenticated } from '@/lib/auth/googleAuth';
import { usePathname, useRouter } from 'next/navigation';
import ChessCloudIcon from './ChessCloud';
import { useMatchmaking } from '@/lib/MatchmakingContext';
import { getUserInfo } from '@/lib/auth/googleAuth';
import { toast } from 'sonner';

type NavItem = {
  name: string;
  href: string;
  hasChildren?: boolean;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const {
    isMatchmaking,
    startMatchmaking,
    cancelMatchmaking,
    playCooldownState,
    cooldownRemaining,
  } = useMatchmaking();
  const userInfo = getUserInfo();
  const username = userInfo?.email?.split('@')[0] || 'anonymous';

  const navigationItems: NavItem[] = [
    { name: 'Features', href: '/features' },
    { name: 'Tournaments', href: '/tournaments' },
    { name: 'Docs', href: '/docs' },
    { name: 'Blog', href: '/blog' },
    { name: 'Resources', href: '/resources', hasChildren: true },
  ];

  const isDashboardPage = pathname.startsWith('/dashboard');

  const loadingDots = (
    <span className="inline-flex ml-1">
      <span className="animate-bounce mx-0.5" style={{ animationDelay: '0ms' }}>
        .
      </span>
      <span
        className="animate-bounce mx-0.5"
        style={{ animationDelay: '150ms' }}
      >
        .
      </span>
      <span
        className="animate-bounce mx-0.5"
        style={{ animationDelay: '300ms' }}
      >
        .
      </span>
    </span>
  );

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    const handleScroll = () => setScrolled(window.scrollY > 10);
    const handleKeyUp = () => setPressedKey(null);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      const key = e.key.toLowerCase();
      if (key === 'p') {
        setPressedKey('p');
        if (authenticated) {
          if (isMatchmaking) {
            cancelMatchmaking();
            toast.info('Matchmaking canceled');
          } else {
            startMatchmaking(username);
            toast.success('Finding a match...', {
              description: "We'll connect you with a player soon",
            });
          }
        } else {
          setTimeout(() => router.push('/signin'), 150);
        }
      } else if (key === 'd' && authenticated && !isDashboardPage) {
        setPressedKey('d');
        setTimeout(() => router.push('/dashboard'), 150);
      } else if (key === 'h' && authenticated && isDashboardPage) {
        setPressedKey('h');
        setTimeout(() => router.push('/home'), 150);
      } else if (key === 's' && !authenticated) {
        setPressedKey('s');
        setTimeout(() => router.push('/signup'), 150);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    authenticated,
    isMatchmaking,
    isDashboardPage,
    username,
    router,
    cancelMatchmaking,
    startMatchmaking,
  ]);

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  const handlePlayClick = async () => {
    setPressedKey('p');
    setMobileMenuOpen(false);
    setPressedKey(null);

    if (playCooldownState === 'cooldown' && !isMatchmaking) {
      toast.info(
        `Please wait ${Math.ceil(
          cooldownRemaining / 1000
        )} seconds before trying again`
      );
      return;
    }

    if (isMatchmaking) {
      toast.info('Matchmaking canceled');
      await cancelMatchmaking();
      return;
    }

    if (!authenticated) {
      setTimeout(() => router.push('/signin'), 150);
      return;
    }

    toast.success('Finding a match...', {
      description: "We'll connect you with a player soon",
    });

    try {
      await startMatchmaking(username);
    } finally {
      setPressedKey(null);
    }
  };

  const handleDashboardSignUpClick = () => {
    setMobileMenuOpen(false);
    if (authenticated) {
      router.push(isDashboardPage ? '/home' : '/dashboard');
    } else {
      router.push('/signup');
    }
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
      setTimeout(() => setAnimating(false), 50);
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
        {/* Logo & Desktop Nav */}
        <div className="flex items-center">
          <button
            onClick={() => handleNavClick(authenticated ? '/home' : '/')}
            className="flex items-center cursor-pointer"
          >
            <ChessCloudIcon />
            <span className="font-semibold text-lg text-amber-900 dark:text-amber-100 ml-2">
              ChessClouds
            </span>
          </button>
          <nav className="hidden xl:flex ml-10 space-x-8">
            {navigationItems.map((item) =>
              item.hasChildren ? (
                <div key={item.name} className="relative group">
                  <button className="text-sm text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50 flex items-center">
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
                  className="text-sm text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50"
                >
                  {item.name}
                </button>
              )
            )}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center space-x-3">
          <ThemeSwitch />

          {/* Dashboard / Sign up */}
          <div className="hidden md:block">
            <Button
              variant="outline"
              className={`h-9 text-sm border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 transition-all shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[2px] dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50 dark:shadow-[0_3px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569] ${
                pressedKey === (isDashboardPage ? 'h' : 'd')
                  ? 'transform translate-y-[3px] shadow-none bg-amber-100 dark:bg-slate-800'
                  : ''
              }`}
              onClick={handleDashboardSignUpClick}
              onMouseUp={() => setPressedKey(null)}
            >
              {isDashboardPage ? 'Home' : 'Dashboard'}
              <span
                className={`ml-1 text-xs px-1 rounded ${
                  pressedKey === (isDashboardPage ? 'h' : 'd')
                    ? 'bg-amber-200 text-amber-900 dark:bg-slate-700 dark:text-amber-100'
                    : 'bg-amber-100 dark:bg-slate-800'
                }`}
              >
                {' '}
                {isDashboardPage ? 'H' : 'D'}{' '}
              </span>
            </Button>
          </div>

          {/* Play/Cancel */}
          <div className="hidden sm:block">
            <Button
              className={`h-9 text-sm text-white rounded-md transition-all hover:translate-y-[2px] 
                bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 
                shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e]
                ${
                  pressedKey === 'p'
                    ? 'transform translate-y-[3px] shadow-none bg-amber-700 dark:bg-amber-600'
                    : ''
                }`}
              onClick={handlePlayClick}
              onMouseUp={() => setPressedKey(null)}
              disabled={playCooldownState === 'cooldown' && !isMatchmaking}
            >
              {isMatchmaking ? (
                <>
                  Finding{loadingDots}
                  <span className="ml-1 text-xs px-1 rounded bg-amber-700 dark:bg-amber-600">
                    P
                  </span>
                </>
              ) : playCooldownState === 'cooldown' ? (
                <>Wait {Math.ceil(cooldownRemaining / 1000)}s</>
              ) : (
                <>
                  Play now
                  <span className="ml-1 text-xs px-1 rounded bg-amber-700 dark:bg-amber-600">
                    P
                  </span>
                </>
              )}
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="xl:hidden flex items-center justify-center h-9 w-9 border border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 rounded-md transition-all shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[2px] dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50 dark:shadow-[0_3px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]"
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
              className="w-full text-left py-2 px-3 text-base text-amber-800 hover:bg-amber-100/70 dark:text-amber-200 dark:hover:bg-slate-800/70 rounded-md flex justify-between"
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

          {/* Mobile Dashboard/Signup */}
          <div className="md:hidden">
            <Button
              variant="outline"
              className="w-full mt-2 border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 transition-all shadow-[0_3px_0_0_#fcd34d] hover:shadow-[0_1px_0_0_#fcd34d] hover:translate-y-[2px] dark:border-slate-700 dark:text-amber-200 dark:hover:bg-slate-800/50 dark:shadow-[0_3px_0_0_#475569] dark:hover:shadow-[0_1px_0_0_#475569]"
              onClick={handleDashboardSignUpClick}
            >
              {isDashboardPage
                ? 'Home'
                : authenticated
                ? 'Dashboard'
                : 'Sign up'}
              <span className="ml-1 text-xs px-1 rounded bg-amber-100 dark:bg-slate-800">
                {isDashboardPage ? 'H' : authenticated ? 'D' : 'S'}
              </span>
            </Button>
          </div>

          {/* Mobile Play */}
          <div className="sm:hidden">
            <Button
              className={`w-full mt-2 text-sm text-white rounded-md transition-all hover:translate-y-[2px] ${
                isMatchmaking
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e]'
                  : 'bg-amber-600 hover:bg-amber-700 shadow-[0_3px_0_0_#b45309] hover:shadow-[0_1px_0_0_#92400e]'
              }`}
              disabled={playCooldownState === 'cooldown' && !isMatchmaking}
              onClick={handlePlayClick}
            >
              {isMatchmaking ? (
                <>
                  Finding{loadingDots}
                  <span className="ml-1 text-xs px-1 rounded bg-red-700 dark:bg-red-600">
                    P
                  </span>
                </>
              ) : playCooldownState === 'cooldown' ? (
                <>Wait {Math.ceil(cooldownRemaining / 1000)}s</>
              ) : (
                <>
                  Play now
                  <span className="ml-1 text-xs px-1 rounded bg-amber-700 dark:bg-amber-600">
                    P
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
