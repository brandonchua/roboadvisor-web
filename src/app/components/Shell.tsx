'use client'

import { useEffect, type ReactNode } from 'react'
import s from '../landing.module.css'
import { SiteFooter, SiteHeader } from '../ui/SiteChrome'

// Every page shares the dark terminal chrome on the #111111 application ground.
export default function Shell({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.style.background = '#111111'
    document.body.style.background = '#111111'
  }, [])
  return (
    <div className={s.page}>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
