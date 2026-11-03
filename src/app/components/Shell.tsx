'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import NavBar from './NavBar'

// The home page is a full-bleed landing page with its own header,
// so it skips the shared NavBar and the centred content container.
export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  // The landing page sits on the dark application ground (#111111), including overscroll.
  useEffect(() => {
    const dark = pathname === '/'
    document.documentElement.style.background = dark ? '#111111' : ''
    document.body.style.background = dark ? '#111111' : ''
  }, [pathname])
  if (pathname === '/') return <>{children}</>
  return (
    <>
      <NavBar />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </>
  )
}
