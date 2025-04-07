import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Roboto_Mono, Inter } from 'next/font/google';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ChessCloud - Next Generation Chess Platform',
  description:
    'A next-generation chess platform designed for high-performance gameplay with players worldwide.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initThemeScript = `
    (function() {
      function getInitialTheme() {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
          return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      const theme = getInitialTheme();
      document.documentElement.classList.toggle('dark', theme === 'dark');
    })()
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initThemeScript }} />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${robotoMono.variable} font-sans`}
      >
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

          <Navbar />
          <main className="flex-grow pt-16 relative">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
