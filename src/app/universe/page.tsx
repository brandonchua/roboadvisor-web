'use client'
// Fund universe — the ten funds the RoboAdvisor Engine allocates across.
// Data are daily figures in percent; annualized as return × 252 and volatility × √252.
import { useMemo, useState } from 'react'
import Link from 'next/link'
import funds from '../../data/funds.json'
import cov from '../../data/varcov.json'
import L from '../landing.module.css'
import s from '../ui/sub.module.css'

type Key = 'name' | 'ret' | 'vol' | 'ratio'
const COLS: { key: Key; label: string; num: boolean }[] = [
  { key: 'name', label: 'Fund', num: false },
  { key: 'ret', label: 'Ann. return', num: true },
  { key: 'vol', label: 'Ann. volatility', num: true },
  { key: 'ratio', label: 'Return / vol', num: true },
]

export default function Universe() {
  const base = useMemo(() => funds.map((f, i) => {
    const ret = f.avgReturn * 252
    const vol = Math.sqrt((cov as number[][])[i][i] * 252)
    return { i, name: f.name, ret, vol, ratio: ret / vol }
  }), [])
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: 'ret', dir: -1 })
  const rows = useMemo(() => [...base].sort((a, b) => {
    const x = a[sort.key], y = b[sort.key]
    return (typeof x === 'string' ? x.localeCompare(y as string) : (x as number) - (y as number)) * sort.dir
  }), [base, sort])
  const maxRet = Math.max(...base.map((r) => r.ret))

  return (
    <>
      <section className={s.head}>
        <div className={`${L.wrap} ${s.headInner}`}>
          <div>
            <p className={s.eyebrow}>RoboAdvisor Engine · Coverage</p>
            <h1 className={s.h1}>Fund universe</h1>
            <p className={s.lede}>The ten global and Asian funds the engine allocates across, with return and volatility from historical daily data.</p>
          </div>
          <Link href="/questionnaire" className={L.btnPrimary}>Compute Portfolio Matrix →</Link>
        </div>
      </section>

      <div className={`${L.wrap} ${s.body} ${s.stack}`}>
        <section className={s.panel} aria-labelledby="u-h">
          <div className={s.panelHead}><h2 id="u-h" className={s.panelTitle}>{base.length} funds</h2><span className={s.panelMeta}>select a column to sort</span></div>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th style={{ width: 48 }}>#</th>
                  {COLS.map((c) => (
                    <th key={c.key} className={c.num ? s.num : ''} aria-sort={sort.key === c.key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
                      <button type="button" className={`${s.sortBtn} ${sort.key === c.key ? s.sortOn : ''}`}
                        onClick={() => setSort((p) => ({ key: c.key, dir: p.key === c.key ? (p.dir === 1 ? -1 : 1) : (c.num ? -1 : 1) }))}>
                        {c.label}{sort.key === c.key ? (sort.dir === 1 ? ' ▲' : ' ▼') : ''}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.i}>
                    <td className={s.mono} style={{ color: 'var(--dim)' }}>{String(r.i + 1).padStart(2, '0')}</td>
                    <td>{r.name}</td>
                    <td className={s.num}><span className={s.barCell}><span className={s.bar} aria-hidden="true"><span style={{ width: `${(r.ret / maxRet) * 100}%` }} /></span>{r.ret.toFixed(2)}%</span></td>
                    <td className={s.num}>{r.vol.toFixed(2)}%</td>
                    <td className={s.num}>{r.ratio.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <p className={s.note}>Annualized arithmetically from average daily returns (× 252 trading days) and daily variance (volatility × √252). Historical figures; past performance does not guarantee future results.</p>
      </div>
    </>
  )
}
