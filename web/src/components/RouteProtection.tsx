'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth/googleAuth';
import LoadingScreen from '@/components/LoadingScreen';

const PUBLIC_ROUTES = ['/home', '/signin', '/signup', '/'];

const AUTH_ROUTES = ['/signin', '/signup'];

interface RouteProtectionProps {
  children: React.ReactNode;
}

export default function RouteProtection({ children }: RouteProtectionProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();

      if (authenticated && AUTH_ROUTES.includes(pathname)) {
        router.replace('/home');
        return;
      }

      if (!authenticated && !PUBLIC_ROUTES.includes(pathname)) {
        router.replace('/signin');
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
