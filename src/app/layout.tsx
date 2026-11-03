// src/app/layout.tsx
import './globals.css'
import type { ReactNode } from 'react'
import Shell from './components/Shell'

export const metadata = {
  title:       'FinCow — Institutional analytics and portfolio optimization',
  description: 'An invitation-only analytics suite for five major markets, paired with portfolio optimization built on Modern Portfolio Theory.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={{ background: '#111111', colorScheme: 'dark' }}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* fallback / retina */}
        <link rel="icon" type="image/png" sizes="256x256" href="/favicon-256.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" />
      </head>
      <body className="antialiased" style={{ background: '#111111', margin: 0 }}>
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
