// src/app/settings/page.tsx — technical notes on the RoboAdvisor Engine
import L from '../landing.module.css'
import s from '../ui/sub.module.css'

export default function Settings() {
  return (
    <>
      <section className={s.head}>
        <div className={L.wrap}>
          <p className={s.eyebrow}>RoboAdvisor Engine · Notes</p>
          <h1 className={s.h1}>How the engine is built</h1>
        </div>
      </section>
      <div className={`${L.wrap} ${s.body}`}>
        <section className={`${s.panel} ${s.panelBody}`}>
          <div className={s.prose}>
            <p>The RoboAdvisor Engine uses mean-variance optimization (Markowitz) to build an efficient portfolio for your risk profile. It is built with Next.js and Chart.js.</p>
            <p>Author: Brandon Chua · Course: NUS BMD5302 Financial Modeling</p>
          </div>
        </section>
      </div>
    </>
  )
}
