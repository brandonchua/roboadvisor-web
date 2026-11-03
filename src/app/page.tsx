// src/app/page.tsx — FinCow master landing (institutional terminal layout on the #111111 ground)
import Link from 'next/link'
import s from './landing.module.css'
import { AccessForm, SessionMonitor, TickerGrid } from './landing/Live'

const CHARTS = 'https://charts.fincow.com'

const Bolt = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>
)
const Bars = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
)
const Lock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
)

const WAVE_SPECS = [
  { t: 'Advanced Digital Signal Processing (DSP) Engine', d: 'Multi-horizon frequency-domain isolation separates short-cycle noise from the structural trend.' },
  { t: 'Zero-Lag Multi-Timeframe Filtering Banks', d: 'Synchronized views from intraday to daily, read side by side in one workspace.' },
  { t: 'Staggered Horizon Peak/Trough Calibration Matrices', d: '2-day, 3-day and 5-day synchronized lookbacks frame where each cycle turns.' },
]
const ROBO_SPECS = [
  { t: 'Risk profiling', d: 'A structured questionnaire sets your custom risk-tolerance bounds.' },
  { t: 'Mean-variance optimization', d: 'Modern Portfolio Theory weights a real fund universe along the efficient frontier.' },
  { t: 'Allocation output', d: 'A clear, re-computable portfolio built around your tolerance band.' },
]

export default function Home() {
  return (
    <>
      <section className={s.hero} aria-labelledby="hero-h">
        <div className={`${s.wrap} ${s.heroGrid}`}>
          <div className={s.heroCopy}>
            <p className={s.eyebrow}>Invitation-only · Institutional analytics</p>
            <h1 id="hero-h" className={s.h1}>Decode Market Frequency. <em>Capitalize on Algorithmic Cycle Alignment.</em></h1>
            <p className={s.sub}>
              An invitation-only, institutional-grade analytics suite mapping multi-horizon asset momentum, paired with
              automated portfolio optimization built on Modern Portfolio Theory.
            </p>
            <div className={s.ctas}>
              <a href={`${CHARTS}/login`} className={s.btnPrimary}><Bolt /> Access Waveform Engine</a>
              <Link href="/questionnaire" className={s.btnSecondary}><Bars /> Compute Portfolio Matrix</Link>
            </div>
            <p className={s.facts}><span><b>5</b> markets</span><span><b>3</b> global sessions</span><span><b>Invite-only</b> access</span></p>
          </div>
          <SessionMonitor />
        </div>
      </section>

      <section id="markets" className={s.section} aria-labelledby="markets-h">
        <div className={s.wrap}>
          <div className={s.secHead}>
            <h2 id="markets-h" className={s.h2}>Market regime board</h2>
            <span className={s.secNote}>EUR/USD · GBP/USD · AUD/USD · USD/JPY · XAU/USD</span>
          </div>
          <TickerGrid />
        </div>
      </section>

      <section id="platform" className={s.section} aria-label="The FinCow ecosystem">
        <div className={`${s.wrap} ${s.wings}`}>
          <article className={s.wing} aria-labelledby="wave-h">
            <div className={s.wingKicker}><span>WING 01 · ANALYTICS</span><span>Members only</span></div>
            <h2 id="wave-h" className={s.wingH}>The Waveform Dashboard</h2>
            <p className={s.wingP}>A multi-horizon frequency domain isolation workspace for five major currency and commodity markets.</p>
            <ul className={s.specs}>
              {WAVE_SPECS.map((x, i) => (
                <li key={x.t} className={s.spec}><span className={s.specIdx}>{String(i + 1).padStart(2, '0')}</span><div><div className={s.specT}>{x.t}</div><div className={s.specD}>{x.d}</div></div></li>
              ))}
            </ul>
            <div className={s.wingCta}><a href={`${CHARTS}/login`} className={s.btnPrimary}><Bolt /> Access Waveform Engine</a></div>
          </article>

          <article id="robo" className={s.wing} aria-labelledby="robo-h">
            <div className={s.wingKicker}><span>WING 02 · ALLOCATION</span><span>Open to all</span></div>
            <h2 id="robo-h" className={s.wingH}>The RoboAdvisor Engine</h2>
            <p className={s.wingP}>
              A Modern Portfolio Theory (MPT) framework engineered in partnership with students of the NUS MFDT programme.
              Allocation modeling re-weights funds to optimize the return curve within your custom risk-tolerance bounds.
            </p>
            <ul className={s.specs}>
              {ROBO_SPECS.map((x, i) => (
                <li key={x.t} className={s.spec}><span className={s.specIdx}>{String(i + 1).padStart(2, '0')}</span><div><div className={s.specT}>{x.t}</div><div className={s.specD}>{x.d}</div></div></li>
              ))}
            </ul>
            <div className={s.wingCta}><Link href="/questionnaire" className={s.btnSecondary}><Bars /> Compute Portfolio Matrix</Link></div>
          </article>
        </div>
      </section>

      <section id="access" className={s.section} aria-labelledby="access-h">
        <div className={`${s.wrap} ${s.gate}`}>
          <div className={s.compliance}>
            <span className={s.shield}><Lock /> ACCESS VERIFICATION GATE</span>
            <h2 id="access-h" className={s.h2}>Restricted access</h2>
            <p className={s.compP}>
              Access is strictly restricted to approved algorithmic fund participants and private invitation recipients.
              Accounts are authenticated and distributed exclusively by the FinCow System Administrator.
            </p>
            <a href={`${CHARTS}/login`} className={s.compLink}>Already approved? Sign in →</a>
          </div>
          <AccessForm />
        </div>
      </section>

    </>
  )
}
