// src/app/page.tsx — FinCow landing page (pasture hero, five markets, waveform charts, RoboAdvisor)
import Link from 'next/link'
import s from './landing.module.css'

const CHARTS = 'https://charts.fincow.com'

const MARKETS = [
  { code: 'EUR/USD', name: 'Euro · US dollar',   host: 'charts.fincow.com',        url: CHARTS,                              tag: 'Main'   },
  { code: 'GBP/USD', name: 'Pound · US dollar',  host: 'gbpusd.charts.fincow.com', url: 'https://gbpusd.charts.fincow.com', tag: 'Cable'  },
  { code: 'AUD/USD', name: 'Aussie · US dollar', host: 'audusd.charts.fincow.com', url: 'https://audusd.charts.fincow.com', tag: 'Aussie' },
  { code: 'USD/JPY', name: 'US dollar · Yen',    host: 'usdjpy.charts.fincow.com', url: 'https://usdjpy.charts.fincow.com', tag: 'Yen'    },
  { code: 'XAU/USD', name: 'Gold · US dollar',   host: 'xauusd.charts.fincow.com', url: 'https://xauusd.charts.fincow.com', tag: 'Gold'   },
]
const CADENCES = ['10s', '1m', '5m', '30m', '1d']

function wave(amp: number, period: number, phase: number, w: number, h: number) {
  const pts: string[] = []
  for (let x = 0; x <= w; x += 4) {
    const y = h / 2 + amp * Math.sin((x / period) * 2 * Math.PI + phase)
    pts.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`)
  }
  return pts.join(' ')
}
const FAN_COLORS = ['#e2a91a', '#e2a91a', '#7fc97f', '#7fc97f', '#4caf50', '#4caf50', '#9b8cf0', '#9b8cf0', '#c7b9ff']

export default function Home() {
  return (
    <div className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap"
      />

      <header className={s.hero}>
        <nav aria-label="Main" className={`${s.wrap} ${s.nav}`}>
          <Link href="/" className={s.brand}>
            <img src="/images/fincow-logo.png" alt="" width={44} height={44} />
            <span>FinCow</span>
          </Link>
          <div className={s.navLinks}>
            <a href="#charts">Waveform charts</a>
            <a href="#markets">Markets</a>
            <a href="#robo">RoboAdvisor</a>
            <a href={`${CHARTS}/login`} className={s.pill}>Member sign in</a>
          </div>
        </nav>

        <div className={`${s.wrap} ${s.heroBody}`}>
          <p className={s.eyebrow}>Waveform charts · RoboAdvisor</p>
          <h1 className={s.h1}>Read the market&rsquo;s rhythm.</h1>
          <p className={s.lede}>
            FinCow breaks price into the cycles beneath it, from 10-second ripples to the daily tide.
            Five markets, live prices, one calm view.
          </p>
          <div className={s.ctaRow}>
            <a href={`${CHARTS}/login`} className={s.btnGold}>Sign in to charts</a>
            <Link href="/questionnaire" className={s.btnGhost}>Build a portfolio</Link>
          </div>
          <p className={s.note}>Charts are for approved members. Accounts are issued by the FinCow admin.</p>
        </div>
      </header>

      <section id="markets" aria-labelledby="markets-h" className={s.markets}>
        <div className={`${s.wrap} ${s.marketsCard}`}>
          <div className={s.marketsHead}>
            <h2 id="markets-h" className={s.h2sm}>Five markets, one sign-in</h2>
            <p className={s.small}>Live OANDA prices · switch pairs from inside any chart</p>
          </div>
          <div className={s.marketGrid}>
            {MARKETS.map((m, i) => (
              <a key={m.code} href={m.url} className={s.market}>
                <span className={s.marketTop}>
                  <span className={s.code}>{m.code}</span>
                  <span className={s.tag}>{m.tag}</span>
                </span>
                <svg viewBox="0 0 160 36" width="100%" height="36" aria-hidden="true">
                  <path d={wave(10, 70 + i * 9, i * 0.9, 160, 36)} fill="none" stroke="#2f7d32" strokeWidth="2" strokeLinecap="round" />
                  <path d={wave(6, 150 + i * 14, 1.6 + i * 0.7, 160, 36)} fill="none" stroke="#e2a91a" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
                </svg>
                <span className={s.marketName}>{m.name}</span>
                <span className={s.host}>{m.host}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="charts" aria-labelledby="charts-h" className={s.charts}>
        <div className={`${s.wrap} ${s.split}`}>
          <div className={s.col}>
            <p className={s.eyebrowGreen}>Waveform charts</p>
            <h2 id="charts-h" className={s.h2}>Three panels, one wave field.</h2>
            <p className={s.bodyText}>
              Every chart stacks three panels. The top one follows the fast waves, the middle one the swing,
              and the bottom one the slow fan that sets direction. Change the cadence and the same wave field
              rescales with it.
            </p>
            <ul className={s.chips} aria-label="Cadences">
              {CADENCES.map((c) => <li key={c} className={s.chip}>{c}</li>)}
            </ul>
            <div className={s.panels}>
              <div className={s.panelRow}><span className={s.panelKey}>P0</span><span><b>Fast waves.</b> Where the next turn starts to show.</span></div>
              <div className={s.panelRow}><span className={s.panelKey}>P1</span><span><b>The swing.</b> Colour groups spread evenly so the order is easy to read.</span></div>
              <div className={s.panelRow}><span className={s.panelKey}>P2</span><span><b>The slow fan.</b> The tide underneath every move.</span></div>
            </div>
          </div>
          <figure className={s.figure}>
            <div className={s.figHead}><span>EUR/USD · 5m · P1</span><span>illustration</span></div>
            <svg viewBox="0 0 520 300" width="100%" aria-hidden="true">
              <line x1="0" y1="150" x2="520" y2="150" stroke="#2c4536" strokeWidth="1" />
              {FAN_COLORS.map((c, i) => (
                <path key={i} d={wave(26 + i * 11, 150 + i * 38, 0.35 * i, 520, 300)} fill="none" stroke={c}
                  strokeWidth={i < 2 ? 2.6 : 2} strokeLinecap="round" opacity={(1 - i * 0.06).toFixed(2)} />
              ))}
            </svg>
            <figcaption>Faster waves sit in front, slower ones fan out behind. The spacing between colour groups is what the chart is tuned to keep even.</figcaption>
          </figure>
        </div>
      </section>

      <section id="robo" aria-labelledby="robo-h" className={s.robo}>
        <div className={`${s.wrap} ${s.roboRow}`}>
          <div className={s.roboMain}>
            <p className={s.eyebrowGreen}>RoboAdvisor</p>
            <h2 id="robo-h" className={s.h2md}>A portfolio that fits how you feel about risk.</h2>
            <p className={s.bodyText}>
              Answer a short risk survey and FinCow builds a portfolio from real fund data using Modern Portfolio
              Theory. Built with students of the NUS MFDT programme.
            </p>
            <div className={s.ctaRow}>
              <Link href="/questionnaire" className={s.btnGreen}>Take the survey</Link>
              <Link href="/universe" className={s.btnOutline}>See the fund universe</Link>
            </div>
          </div>
          <div className={s.roboSide}>
            <h3 className={s.h3}>How it works</h3>
            <ol className={s.steps}>
              <li>Tell us your goals and how much swing you can sit through.</li>
              <li>FinCow scores your risk profile.</li>
              <li>It weights funds for the best return at that level of risk.</li>
            </ol>
          </div>
        </div>
      </section>

      <section aria-labelledby="join-h" className={s.join}>
        <div className={`${s.wrap} ${s.joinCard}`}>
          <div className={s.joinText}>
            <h2 id="join-h" className={s.joinH}>Access is by invitation.</h2>
            <p className={s.joinP}>Ask the FinCow admin for an account. Then sign in with your email to open all five charts.</p>
          </div>
          <a href={`${CHARTS}/login`} className={s.btnGold}>Member sign in</a>
        </div>
      </section>

      <footer className={s.footer}>
        <div className={`${s.wrap} ${s.footRow}`}>
          <div className={s.footBrand}>
            <img src="/images/fincow-logo.png" alt="" width={28} height={28} />
            <span>© 2026 FinCow</span>
          </div>
          <div className={s.footLinks}>
            <a href={`${CHARTS}/login`}>Member sign in</a>
            <Link href="/questionnaire">RoboAdvisor</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
