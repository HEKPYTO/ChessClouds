'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === '/signin' || pathname === '/signup' || pathname === '/signout';

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className={`flex-grow ${!isAuthPage ? 'pt-16' : ''} relative`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
}
