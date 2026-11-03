// About FinCow
import Link from 'next/link'
import L from '../landing.module.css'
import s from '../ui/sub.module.css'

const TEAM = ['Brandon Chua Chi Yan', 'Claudia Anna Maria Nori', 'Jong Zhi Kai', 'Kitahara Yutaro', 'Wang Xinyao']
const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export default function AboutPage() {
  return (
    <>
      <section className={s.head}>
        <div className={`${L.wrap} ${s.headInner}`}>
          <div>
            <p className={s.eyebrow}>About · FinCow</p>
            <h1 className={s.h1}>Quantitative tools, built to be understood.</h1>
            <p className={s.lede}>FinCow pairs a members-only market analytics workspace with an open portfolio engine grounded in Modern Portfolio Theory.</p>
          </div>
        </div>
      </section>

      <div className={`${L.wrap} ${s.body} ${s.stack}`}>
        <div className={s.aboutGrid}>
          <section className={`${s.panel} ${s.panelBody}`} aria-labelledby="story-h">
            <h2 id="story-h" className={s.panelTitle} style={{ marginBottom: 14 }}>Our story</h2>
            <div className={s.prose}>
              <p>FinCow began as a robo-advisor built by students of the NUS Master of Digital Financial Technology programme, developed under the guidance of Prof. Lee Hong Sing. The aim was simple: make sophisticated financial models approachable for everyday investors.</p>
              <p>The RoboAdvisor Engine turns a structured risk assessment into a mean-variance allocation across a curated fund universe, so the portfolio reflects your goals and your tolerance for drawdowns.</p>
              <p>Alongside it, the Waveform Dashboard gives approved members a multi-horizon view of five major currency and commodity markets. Access to the dashboard is by invitation.</p>
            </div>
          </section>
          <aside className={`${s.panel} ${s.panelBody}`} aria-label="At a glance">
            <div className={s.panelMeta} style={{ marginBottom: 6 }}>AT A GLANCE</div>
            <div className={s.facts}>
              <div className={s.fact}><span>Products</span><span>Waveform Dashboard · RoboAdvisor Engine</span></div>
              <div className={s.fact}><span>Markets covered</span><span>EUR/USD · GBP/USD · AUD/USD · USD/JPY · XAU/USD</span></div>
              <div className={s.fact}><span>Portfolio method</span><span>Mean-variance optimization (MPT)</span></div>
              <div className={s.fact}><span>Fund universe</span><span>10 global and Asian funds</span></div>
              <div className={s.fact}><span>Dashboard access</span><span>Invitation only</span></div>
              <div className={s.fact}><span>Origin</span><span>National University of Singapore</span></div>
            </div>
          </aside>
        </div>

        <section className={s.panel} aria-labelledby="team-h">
          <div className={s.panelHead}><h2 id="team-h" className={s.panelTitle}>Founding team</h2><span className={s.panelMeta}>{TEAM.length} members</span></div>
          <div className={s.team}>
            {TEAM.map((n) => (
              <div key={n} className={s.member}>
                <span className={s.avatar} aria-hidden="true">{initials(n)}</span>
                <div><div className={s.memberName}>{n}</div><div className={s.memberRole}>Founding team</div></div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link href="/questionnaire" className={L.btnSecondary}>Compute Portfolio Matrix</Link>
          <Link href="/#access" className={L.btnSecondary}>Request dashboard access</Link>
        </div>
      </div>
    </>
  )
}
