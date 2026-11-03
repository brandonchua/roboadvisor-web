'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import NavBar from './NavBar'

// The home page is a full-bleed landing page with its own header,
// so it skips the shared NavBar and the centred content container.
export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/') return <>{children}</>
  return (
    <>
      <NavBar />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </>
  )
}
