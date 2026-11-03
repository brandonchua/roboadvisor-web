'use client'
// RoboAdvisor Engine — risk profile assessment (step 1 of 2)
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import questions from '../../data/questionnaire.json'
import L from '../landing.module.css'
import s from '../ui/sub.module.css'

type Q = { id: string; text: string; type: string; options: string[] }
const QS = questions as Q[]

const SECTIONS: { key: string; title: string }[] = [
  { key: 'q1', title: 'Personal profile' },
  { key: 'q2', title: 'Financial position' },
  { key: 'q3', title: 'Goals and time horizon' },
  { key: 'q4', title: 'Risk attitude' },
  { key: 'q5', title: 'Investor behaviour' },
  { key: 'q6', title: 'Other considerations' },
]
const clean = (t: string) => t.replace(/\s*\*Multiple choice\*\s*/i, '').trim()

export default function Questionnaire() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [tried, setTried] = useState(false)

  const required = useMemo(() => QS.filter((q) => q.type === 'single'), [])
  const isDone = (q: Q) => (q.type === 'single' ? !!answers[q.id] : Array.isArray(answers[q.id]) && (answers[q.id] as string[]).length > 0)
  const answered = required.filter(isDone).length
  const pct = Math.round((answered / required.length) * 100)
  const missing = required.filter((q) => !isDone(q))

  const setSingle = (id: string, v: string) => setAnswers((a) => ({ ...a, [id]: v }))
  const toggleMulti = (id: string, v: string, on: boolean) =>
    setAnswers((a) => {
      let prev = (a[id] as string[]) || []
      if (v === 'None' && on) prev = []
      else prev = prev.filter((x) => x !== 'None')
      return { ...a, [id]: on ? [...prev, v] : prev.filter((x) => x !== v) }
    })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setTried(true)
    if (missing.length) { document.getElementById(missing[0].id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return }
    router.push(`/recommendation?answers=${encodeURIComponent(JSON.stringify(answers))}`)
  }

  let n = 0
  return (
    <>
      <section className={s.head}>
        <div className={`${L.wrap} ${s.headInner}`}>
          <div>
            <p className={s.eyebrow}>RoboAdvisor Engine · Step 1 of 2</p>
            <h1 className={s.h1}>Risk profile assessment</h1>
            <p className={s.lede}>Twenty-two questions set your risk-tolerance bounds. The engine then computes a Modern Portfolio Theory allocation across our fund universe. It takes about four minutes; nothing is stored.</p>
          </div>
        </div>
      </section>

      <form className={`${L.wrap} ${s.body}`} onSubmit={submit} noValidate>
        <div className={s.layout}>
          <div className={s.stack}>
            {SECTIONS.map((sec) => {
              const qs = QS.filter((q) => q.id.startsWith(sec.key + '_'))
              if (!qs.length) return null
              return (
                <section key={sec.key} id={sec.key} className={s.panel} aria-labelledby={`${sec.key}-h`}>
                  <div className={s.panelHead}>
                    <h2 id={`${sec.key}-h`} className={s.panelTitle}>{sec.title}</h2>
                    <span className={s.panelMeta}>{qs.filter(isDone).length}/{qs.length} answered</span>
                  </div>
                  {qs.map((q) => {
                    n += 1
                    const multi = q.type !== 'single'
                    const bad = tried && !multi && !answers[q.id]
                    return (
                      <fieldset key={q.id} id={q.id} className={`${s.q} ${bad ? s.qMissing : ''}`} style={{ border: 0, margin: 0, minWidth: 0 }}>
                        <legend className={s.qText} style={{ padding: 0, float: 'left', width: '100%' }}>
                          <span className={s.qIdx}>Q{String(n).padStart(2, '0')}</span>
                          <span>{clean(q.text)}{multi && <span className={s.qHint}>select all that apply</span>}</span>
                        </legend>
                        <div className={s.opts} style={{ clear: 'both' }}>
                          {q.options.map((opt) => {
                            const checked = multi ? ((answers[q.id] as string[]) || []).includes(opt) : answers[q.id] === opt
                            return (
                              <label key={opt} className={s.opt}>
                                <input type={multi ? 'checkbox' : 'radio'} name={q.id} value={opt} checked={checked}
                                  onChange={(e) => (multi ? toggleMulti(q.id, opt, e.target.checked) : setSingle(q.id, opt))} />
                                <span>{opt}</span>
                              </label>
                            )
                          })}
                        </div>
                      </fieldset>
                    )
                  })}
                </section>
              )
            })}
          </div>

          <aside className={s.side} aria-label="Progress">
            <div className={`${s.panel} ${s.panelBody}`}>
              <div className={s.panelMeta}>COMPLETION</div>
              <div className={s.progressNum}>{pct}%</div>
              <div className={s.progress} aria-hidden="true"><span style={{ width: `${pct}%` }} /></div>
              <div className={s.note}>{answered} of {required.length} required questions answered</div>
            </div>
            <nav className={`${s.panel} ${s.panelBody} ${s.toc}`} aria-label="Sections">
              {SECTIONS.map((sec) => {
                const qs = QS.filter((q) => q.id.startsWith(sec.key + '_'))
                const done = qs.filter(isDone).length
                return <a key={sec.key} href={`#${sec.key}`} className={done === qs.length ? s.tocDone : ''}><span>{sec.title}</span><b>{done}/{qs.length}</b></a>
              })}
            </nav>
            <div className={s.submitRow}>
              <button type="submit" className={L.btnPrimary} style={{ border: 0, cursor: 'pointer', width: '100%', justifyContent: 'center' }}>Compute Portfolio Matrix →</button>
              {tried && missing.length > 0 && <p className={s.error} role="alert" style={{ width: '100%' }}>{missing.length} question{missing.length > 1 ? 's' : ''} still need an answer.</p>}
            </div>
          </aside>
        </div>
      </form>
    </>
  )
}
