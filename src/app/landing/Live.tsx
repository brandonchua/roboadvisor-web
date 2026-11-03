'use client'
// Live pieces of the FinCow landing page: regime grid, session monitor, world clocks, access form.
// Everything shown here is real: regimes come from charts.fincow.com/__gate/pulse (computed on our
// server from hourly prices), clocks and sessions from the visitor's own clock.
import { useEffect, useMemo, useState } from 'react'
import s from '../landing.module.css'

const GATE = 'https://charts.fincow.com'
const PAIRS = [
  { ins: 'EUR_USD', code: 'EUR/USD', name: 'Euro · US Dollar' },
  { ins: 'GBP_USD', code: 'GBP/USD', name: 'Pound · US Dollar' },
  { ins: 'AUD_USD', code: 'AUD/USD', name: 'Aussie · US Dollar' },
  { ins: 'USD_JPY', code: 'USD/JPY', name: 'US Dollar · Yen' },
  { ins: 'XAU_USD', code: 'XAU/USD', name: 'Gold · US Dollar' },
]
type PulsePair = { instrument: string; regime: string | null; direction?: 'up' | 'down' | 'flat'; volPercentile?: number; asOf?: string }
type Pulse = { generatedAt: string; basis: string; pairs: PulsePair[] }

const fmt = (d: Date, tz: string, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, ...opts }).format(d)
const sgt = (iso?: string) => (iso ? fmt(new Date(iso), 'Asia/Singapore', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--')

function useNow(ms = 1000) {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => { setNow(new Date()); const id = setInterval(() => setNow(new Date()), ms); return () => clearInterval(id) }, [ms])
  return now
}

let pulseOnce: Promise<Pulse> | null = null
function usePulse() {
  const [state, setState] = useState<{ data: Pulse | null; status: 'loading' | 'live' | 'offline' }>({ data: null, status: 'loading' })
  useEffect(() => {
    let alive = true
    const load = () => {
      pulseOnce = pulseOnce || fetch(`${GATE}/__gate/pulse`, { cache: 'no-store' }).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() })
      pulseOnce.then((d) => alive && setState({ data: d, status: 'live' })).catch(() => alive && setState((x) => ({ data: x.data, status: x.data ? 'live' : 'offline' })))
        .finally(() => { setTimeout(() => { pulseOnce = null }, 60000) })
    }
    load(); const id = setInterval(load, 5 * 60000)
    return () => { alive = false; clearInterval(id) }
  }, [])
  return state
}

const regimeTone = (r?: string | null) =>
  !r ? s.toneMuted : /High Velocity/.test(r) ? s.toneGold : /Two-Way/.test(r) ? s.toneRed : /Consolidation/.test(r) ? s.toneBlue : /Directional/.test(r) ? s.toneGreen : s.toneMuted

export function FeedStatus() {
  const { data, status } = usePulse()
  return (
    <span className={s.feed} title={data?.basis || ''}>
      <span className={`${s.dot} ${status === 'live' ? s.dotLive : status === 'offline' ? s.dotOff : s.dotWait}`} aria-hidden="true" />
      {status === 'live' ? `Regime feed live · ${sgt(data?.generatedAt)} SGT` : status === 'offline' ? 'Regime feed offline' : 'Connecting…'}
    </span>
  )
}

export function TickerGrid() {
  const { data, status } = usePulse()
  const byIns = useMemo(() => Object.fromEntries((data?.pairs || []).map((p) => [p.instrument, p])), [data])
  return (
    <>
      <div className={s.tickers}>
        {PAIRS.map((m) => {
          const p: PulsePair | undefined = byIns[m.ins]
          const arrow = p?.direction === 'up' ? '▲' : p?.direction === 'down' ? '▼' : '■'
          return (
            <a key={m.ins} href={`${GATE}/login`} className={s.ticker} aria-label={`${m.code} — sign in to open the chart`}>
              <div className={s.tickTop}>
                <span className={s.tickCode}>{m.code}</span>
                <span className={`${s.dir} ${p?.direction === 'up' ? s.up : p?.direction === 'down' ? s.down : ''}`} aria-hidden="true">{p?.regime ? arrow : ''}</span>
              </div>
              <div className={s.tickName}>{m.name}</div>
              {status === 'loading' ? (
                <span className={`${s.pill} ${s.skeleton}`}>Loading regime…</span>
              ) : p?.regime ? (
                <span className={`${s.pill} ${regimeTone(p.regime)}`}>Regime: {p.regime}</span>
              ) : (
                <span className={`${s.pill} ${s.toneMuted}`}>Regime: unavailable</span>
              )}
              <div className={s.tickMeta}>
                <span>24h vol pctile <b>{p?.volPercentile ?? '—'}</b></span>
                <span>SGT {sgt(p?.asOf)}</span>
              </div>
              <div className={s.volBar} aria-hidden="true"><span style={{ width: `${p?.volPercentile ?? 0}%` }} /></div>
            </a>
          )
        })}
      </div>
      <p className={s.footnote}>
        {status === 'offline'
          ? 'The public regime feed is offline. Members see full live charts after sign-in.'
          : 'Regime reads 24-hour realized volatility against its 30-day range, plus 24-hour drift, on hourly prices. Informational only; not a trading signal.'}
      </p>
    </>
  )
}

// FX sessions in UTC (approximate): Tokyo 00–09, London 07–16, New York 12–21; market shut Fri 21:00 → Sun 21:00 UTC.
const SESSIONS = [
  { name: 'Tokyo', open: 0, close: 9 },
  { name: 'London', open: 7, close: 16 },
  { name: 'New York', open: 12, close: 21 },
]
function fxClosed(d: Date) {
  const day = d.getUTCDay(), h = d.getUTCHours()
  return day === 6 || (day === 5 && h >= 21) || (day === 0 && h < 21)
}

export function SessionMonitor() {
  const now = useNow(1000)
  const { data, status } = usePulse()
  const h = now ? now.getUTCHours() + now.getUTCMinutes() / 60 : -1
  const closed = now ? fxClosed(now) : false
  return (
    <aside className={s.monitor} aria-label="Session monitor">
      <div className={s.monHead}><span>SESSION MONITOR</span><span className={s.monTime}>{now ? `${fmt(now, 'UTC', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })} UTC` : '--:--:-- UTC'}</span></div>
      <ul className={s.monList}>
        {SESSIONS.map((x) => {
          const open = !closed && h >= x.open && h < x.close
          return (
            <li key={x.name} className={s.monRow}>
              <span className={`${s.dot} ${open ? s.dotLive : s.dotOff}`} aria-hidden="true" />
              <span className={s.monName}>{x.name}</span>
              <span className={open ? s.monOpen : s.monClosed}>{now ? (open ? 'OPEN' : 'CLOSED') : '—'}</span>
              <span className={s.monHours}>{String(x.open).padStart(2, '0')}:00–{String(x.close).padStart(2, '0')}:00 UTC</span>
            </li>
          )
        })}
      </ul>
      <div className={s.monFoot}>
        <span>FX market</span><span className={closed ? s.monClosed : s.monOpen}>{now ? (closed ? 'WEEKEND CLOSE' : 'TRADING') : '—'}</span>
      </div>
      <div className={s.monFoot}>
        <span>Regime feed</span><span className={status === 'live' ? s.monOpen : s.monClosed}>{status === 'live' ? `UPDATED ${sgt(data?.generatedAt)} SGT` : status === 'offline' ? 'OFFLINE' : '…'}</span>
      </div>
    </aside>
  )
}

const CITIES = [
  { code: 'SGT', city: 'Singapore', tz: 'Asia/Singapore' },
  { code: 'LON', city: 'London', tz: 'Europe/London' },
  { code: 'NY', city: 'New York', tz: 'America/New_York' },
]
export function WorldClocks() {
  const now = useNow(1000)
  return (
    <div className={s.clocks} role="group" aria-label="World clocks">
      {CITIES.map((c) => (
        <div key={c.code} className={s.clock}>
          <span className={s.clockCode}>{c.code}</span>
          <span className={s.clockTime}>{now ? fmt(now, c.tz, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : '--:--:--'}</span>
          <span className={s.clockDate}>{now ? `${c.city} · ${fmt(now, c.tz, { weekday: 'short', day: '2-digit', month: 'short' })}` : c.city}</span>
        </div>
      ))}
    </div>
  )
}

export function AccessForm() {
  const [email, setEmail] = useState('')
  const [hp, setHp] = useState('')
  const [st, setSt] = useState<{ k: 'idle' | 'busy' | 'ok' | 'err'; msg: string }>({ k: 'idle', msg: 'AWAITING INPUT' })
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setSt({ k: 'err', msg: 'INVALID EMAIL FORMAT' }); return }
    setSt({ k: 'busy', msg: 'TRANSMITTING REQUEST…' })
    try {
      const r = await fetch(`${GATE}/__gate/request-access`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), website: hp }) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(j.error || 'Request failed.')
      setSt({ k: 'ok', msg: 'REQUEST LOGGED · THE ADMINISTRATOR WILL CONTACT YOU' }); setEmail('')
    } catch (err) {
      setSt({ k: 'err', msg: String((err as Error).message || 'Request service unavailable.').toUpperCase() })
    }
  }
  const ring = st.k === 'ok' ? s.ringOk : st.k === 'err' ? s.ringErr : st.k === 'busy' ? s.ringBusy : s.ringIdle
  return (
    <form className={s.term} onSubmit={submit} noValidate>
      <div className={s.termBar} aria-hidden="true"><span /><span /><span /><em>fincow · access-gateway</em></div>
      <label htmlFor="acc-email" className={s.termLabel}>Request an invitation</label>
      <div className={s.termLine}>
        <span className={s.prompt} aria-hidden="true">fincow@access:~$ request --email</span>
        <input id="acc-email" type="email" inputMode="email" autoComplete="email" placeholder="you@fund.com" value={email}
          onChange={(e) => { setEmail(e.target.value); if (st.k !== 'busy') setSt({ k: 'idle', msg: 'AWAITING INPUT' }) }} className={s.termInput} required />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} className={s.hp} aria-hidden="true" />
        <button type="submit" className={s.termBtn} disabled={st.k === 'busy'}>Submit ⏎</button>
      </div>
      <div className={s.termStatus} role="status" aria-live="polite">
        <span className={`${s.ring} ${ring}`} aria-hidden="true" />
        <span>{st.msg}</span>
      </div>
    </form>
  )
}
