'use client'
// Shared dark terminal chrome for every FinCow page: top bar (with live regime-feed status) and footer clocks.
import Link from 'next/link'
import s from '../landing.module.css'
import { FeedStatus, WorldClocks } from '../landing/Live'

export const CHARTS = 'https://charts.fincow.com'

export function SiteHeader() {
  return (
    <header className={s.top}>
      <div className={`${s.wrap} ${s.topRow}`}>
        <Link href="/" className={s.brand}>
          <img src="/images/fincow-logo.png" alt="" width={30} height={30} />
          FinCow <span className={s.tag}>TERMINAL</span>
        </Link>
        <nav aria-label="Main" className={s.nav}>
          <Link href="/#markets">Markets</Link>
          <Link href="/questionnaire">RoboAdvisor</Link>
          <Link href="/universe">Fund universe</Link>
          <Link href="/about">About</Link>
        </nav>
        <div className={s.topRight}>
          <FeedStatus />
          <a href={`${CHARTS}/login`} className={s.btnSm}>Member sign in</a>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className={s.foot}>
      <div className={s.wrap}>
        <WorldClocks />
        <div className={s.footRow}>
          <div className={s.footBrand}><img src="/images/fincow-logo.png" alt="" width={22} height={22} /><span>© 2026 FinCow</span></div>
          <div className={s.footLinks}>
            <a href={`${CHARTS}/login`}>Member sign in</a>
            <Link href="/questionnaire">RoboAdvisor</Link>
            <Link href="/universe">Fund universe</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
        <p className={s.disclaimer}>FinCow provides analytics and educational portfolio tools. Nothing on this site is investment advice or an offer to buy or sell any financial product.</p>
      </div>
    </footer>
  )
}
