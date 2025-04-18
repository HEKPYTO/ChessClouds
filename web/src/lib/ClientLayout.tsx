'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth/googleAuth';

const PUBLIC_ROUTES = ['/home', '/signin', '/signup', '/'];

const AUTH_ROUTES = ['/signin', '/signup'];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [, setMounted] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [isRoutingChecked, setIsRoutingChecked] = useState(false);

  const isAuthPage =
    pathname === '/signin' ||
    pathname === '/signup' ||
    pathname === '/signout' ||
    pathname === '/debug';

  useEffect(() => {
    const checkRouteAccess = () => {
      const authenticated = isAuthenticated();

      if (authenticated && AUTH_ROUTES.includes(pathname)) {
        router.replace('/home');
        return false;
      }

      if (!authenticated && !PUBLIC_ROUTES.includes(pathname)) {
        router.replace('/signin');
        return false;
      }

      return true;
    };

    const timer = setTimeout(() => {
      setMounted(true);

      const routeAccessible = checkRouteAccess();
      if (routeAccessible) {
        setShowLoading(false);
      }

      setIsRoutingChecked(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, router]);

  if (showLoading || !isRoutingChecked) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col">
      {!isAuthPage && <Navbar />}
      <main
        className={`flex-1 min-h-screen ${!isAuthPage ? 'pt-16' : ''} relative`}
      >
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
