// src/app/layout.tsx
import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { ReactNode } from 'react'
import NavBar            from './components/NavBar'

export const metadata = {
  title:       'RoboAdvisor',
  description: 'Mean-variance portfolio builder',
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
        <NavBar />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}