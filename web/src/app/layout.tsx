import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Roboto_Mono, Inter } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout';

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
  title: 'ChessClouds - Next Generation Chess Platform',
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
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initThemeScript }} />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${robotoMono.variable} font-sans`}
      >
        <div className="min-h-screen relative bg-amber-50 dark:bg-slate-900">
          <div
            className="absolute inset-0 pointer-events-none bg-[url('/noise.png')] bg-repeat"
            style={{ opacity: 0.03 }}
          />
          <div
            className="
              absolute inset-0 pointer-events-none
              [background-image:linear-gradient(90deg,rgba(241,194,125,0.15)_1px,transparent_1px),linear-gradient(180deg,rgba(241,194,125,0.15)_1px,transparent_1px)]
              dark:[background-image:linear-gradient(90deg,rgba(255,191,0,0.15)_1px,transparent_1px),linear-gradient(180deg,rgba(255,191,0,0.15)_1px,transparent_1px)]
              [background-size:20px_20px]
            "
          />

          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  );
}
