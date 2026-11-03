// src/app/layout.tsx
import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { ReactNode } from 'react'
import Shell from './components/Shell'

export const metadata = {
  title:       'FinCow — Waveform charts and RoboAdvisor',
  description: 'Members-only market charts and a RoboAdvisor that builds portfolios with Modern Portfolio Theory.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* fallback / retina */}
        <link rel="icon" type="image/png" sizes="256x256" href="/favicon-256.png" />
      </head>
      <body className="antialiased bg-gray-50 text-gray-800">
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
