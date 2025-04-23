// src/app/api/optimize/route.ts
import { NextRequest, NextResponse } from 'next/server'
import covData from '../../../data/varcov.json'
import funds   from '../../../data/funds.json'
import { computeRawScore, computeRiskAversion, getRiskProfile } from '../../../lib/risk'
import { optimize, optimizeR } from '../../../lib/portfolio'

export async function POST(req: NextRequest) {
  // 1) parse the survey answers from the body
  const answers = (await req.json()) as Record<string, any>

  // 2) compute raw score & aversion A
  const rawScore = computeRawScore(answers)
  const A        = computeRiskAversion(answers)

  // 3) pick your precomputed weight bucket (or run your optimizer here)
  const weights  = /* either your weightBuckets[A] or: */
                   optimize(
                     funds.map(f=>f.avgReturn), 
                     covData as number[][], 
                     A
                   )

  // 4) build the 6 key stats:
  const portRet     = weights.reduce((sum,w,i) => sum + w * funds[i].avgReturn, 0)
  const variance    = weights.reduce((s, w, i) =>
                      s + w * covData[i].reduce((ss, c, j) => ss + c * weights[j],0),
                      0
                    )
  const stdDev      = Math.sqrt(variance)
  const utility     = portRet - 0.5 * A * variance
  const bestCase    = portRet + 2 * stdDev
  const worstCase   = portRet - 2 * stdDev
  const medianRet   = portRet

  // 5) and send it all back:
  return NextResponse.json({
    aversion: A,
    rawScore,
    profile: getRiskProfile(rawScore).profile,
    weights,
    stats: {
      return:    portRet,
      stdDev,
      utility,
      bestCase,
      worstCase,
      median:    medianRet,
    }
  })
}