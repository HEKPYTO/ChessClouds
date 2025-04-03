import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chess App',
  description: 'React Chessground and Lichess PGN Viewer Demo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/react-chessground@1.5.0/dist/styles/chessground.css" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}