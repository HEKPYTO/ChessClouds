'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [mounted, setMounted] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  const isAuthPage =
    pathname === '/signin' ||
    pathname === '/signup' ||
    pathname === '/signout' ||
    pathname === '/dev';

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setShowLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (showLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}
      <main className={`flex-1 ${!isAuthPage ? 'pt-16' : ''} relative`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
