'use client'
// RoboAdvisor Engine — portfolio matrix (step 2 of 2)
// Units: fund data and the optimizer's stats are daily figures expressed in percent
// (e.g. return 0.158 = 0.158% per trading day). Annualized here as return × 252 and
// volatility × √252, the same convention the Fund universe page uses.
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PieChart, { ALLOC_COLORS } from './PieChart'
import funds from '../../data/funds.json'
import { getProfileForA } from '../../lib/risk'
import L from '../landing.module.css'
import s from '../ui/sub.module.css'

interface ApiResponse {
  aversion: number
  weights: number[]
  stats: { return: number; stdDev: number; utility: number; bestCase: number; worstCase: number; median: number }
}
const pct = (x: number, d = 2) => `${x >= 0 ? '' : '−'}${Math.abs(x).toFixed(d)}%`

export default function RecommendationPage() {
  const router = useRouter()
  const [data, setData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('answers')
    let answers: Record<string, unknown>
    try { if (!raw) throw new Error(); answers = JSON.parse(raw) } catch { router.replace('/questionnaire'); return }
    fetch('/api/optimize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(answers) })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() as Promise<ApiResponse> })
      .then(setData)
      .catch(() => setError('The engine could not compute your portfolio. Please run the assessment again.'))
  }, [router])

  const head = (
    <section className={s.head}>
      <div className={`${L.wrap} ${s.headInner}`}>
        <div>
          <p className={s.eyebrow}>RoboAdvisor Engine · Step 2 of 2</p>
          <h1 className={s.h1}>Portfolio matrix</h1>
          <p className={s.lede}>Your mean-variance allocation across the FinCow fund universe, weighted to your risk-tolerance bounds.</p>
        </div>
        <Link href="/questionnaire" className={L.btnSecondary}>Re-run assessment</Link>
      </div>
    </section>
  )

  if (error) return <>{head}<div className={`${L.wrap} ${s.body}`}><p className={s.error} role="alert">{error}</p></div></>
  if (!data) return <>{head}<div className={`${L.wrap} ${s.body}`}><p className={s.muted} role="status">Computing allocation…</p></div></>

  const { aversion, weights, stats } = data
  const { profile, description } = getProfileForA(aversion)
  const rows = funds.map((f, i) => ({ name: f.name, color: ALLOC_COLORS[i % ALLOC_COLORS.length], alloc: weights[i] * 100, annRet: f.avgReturn * 252 }))
  const sorted = [...rows].sort((a, b) => b.alloc - a.alloc)
  const total = rows.reduce((t, r) => t + r.alloc, 0)
  const held = rows.filter((r) => r.alloc > 0.005).length

  return (
    <>
      {head}
      <div className={`${L.wrap} ${s.body} ${s.stack}`}>
        <div><span className={s.profile}>Risk aversion A = {aversion} · {profile}{description ? ` · ${description}` : ''}</span></div>

        <div className={s.kpis}>
          <div className={s.kpi}><span className={s.kpiLabel}>Expected return</span><span className={s.kpiValue}>{pct(stats.return * 252, 1)}</span><span className={s.kpiSub}>annualized · {pct(stats.return, 3)} per day</span></div>
          <div className={s.kpi}><span className={s.kpiLabel}>Volatility</span><span className={s.kpiValue}>{pct(stats.stdDev * Math.sqrt(252), 1)}</span><span className={s.kpiSub}>annualized · {pct(stats.stdDev, 3)} per day</span></div>
          <div className={s.kpi}><span className={s.kpiLabel}>Typical daily range</span><span className={s.kpiValue} style={{ fontSize: 20 }}>{pct(stats.worstCase)} to +{stats.bestCase.toFixed(2)}%</span><span className={s.kpiSub}>expected return ± 2 standard deviations</span></div>
          <div className={s.kpi}><span className={s.kpiLabel}>Funds held</span><span className={s.kpiValue}>{held} / {rows.length}</span><span className={s.kpiSub}>mean-variance utility {stats.utility.toFixed(4)}</span></div>
        </div>

        <div className={s.twoCol}>
          <section className={s.panel} aria-labelledby="mix-h">
            <div className={s.panelHead}><h2 id="mix-h" className={s.panelTitle}>Allocation mix</h2><span className={s.panelMeta}>{held} funds</span></div>
            <div className={s.panelBody}><div className={s.chartBox}><PieChart labels={rows.map((r) => r.name)} data={rows.map((r) => +r.alloc.toFixed(2))} /></div></div>
          </section>

          <section className={s.panel} aria-labelledby="alloc-h">
            <div className={s.panelHead}><h2 id="alloc-h" className={s.panelTitle}>Allocation breakdown</h2><span className={s.panelMeta}>sorted by weight</span></div>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead><tr><th>Fund</th><th className={s.num}>Ann. return</th><th className={s.num}>Weight</th></tr></thead>
                <tbody>
                  {sorted.map((r) => (
                    <tr key={r.name} className={r.alloc < 0.005 ? s.zero : ''}>
                      <td><span className={s.swatch} style={{ background: r.color }} aria-hidden="true" />{r.name}</td>
                      <td className={s.num}>{pct(r.annRet)}</td>
                      <td className={s.num}><span className={s.barCell}><span className={s.bar} aria-hidden="true"><span style={{ width: `${Math.min(100, r.alloc)}%` }} /></span>{r.alloc.toFixed(2)}%</span></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className={s.tfoot}><tr><td>Total</td><td /><td className={s.num}>{total.toFixed(2)}%</td></tr></tfoot>
              </table>
            </div>
          </section>
        </div>

        <p className={s.note}>Figures come from historical fund data and are annualized arithmetically (return × 252 trading days, volatility × √252). Past performance does not guarantee future results. This is an educational model, not investment advice.</p>
      </div>
    </>
  )
}
