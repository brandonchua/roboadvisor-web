// ─────────────────────────────────────────────────────────────────────────────
// File: src/lib/optimizeRoute.ts
// ─────────────────────────────────────────────────────────────────────────────

import covData from '../data/varcov.json'
import funds   from '../data/funds.json'
import { computeRiskAversion } from './risk'
import { optimize }            from './portfolio'

export async function optimizeRoute(
  answers: Record<string, any>
): Promise<{
  aversion: number
  weights:  number[]
  stats:    {
    return:    number
    stdDev:    number
    utility:   number
    bestCase:  number
    worstCase: number
    median:    number
  }
}> {
  // 1) figure out A
  const A = computeRiskAversion(answers)

  // 2) build μ and Σ
  const mu  = funds.map((f) => f.avgReturn)  // make sure your funds.json has avgReturn
  const cov = covData                         // your 10×10 JSON matrix

  // 3) run the long‐only optimizer
  const weights = optimize(mu, cov, A)

  // 4) compute the stats
  const portRet = mu.reduce((sum, r, i) => sum + r * weights[i], 0)
  let portVar = 0
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights.length; j++) {
      portVar += weights[i] * cov[i][j] * weights[j]
    }
  }
  const stdDev    = Math.sqrt(portVar)
  const utility   = portRet - (A/2) * portVar
  const bestCase  = portRet + 2 * stdDev
  const worstCase = portRet - 2 * stdDev
  const median    = portRet

  return {
    aversion: A,
    weights,
    stats: {
      return:    portRet,
      stdDev,
      utility,
      bestCase,
      worstCase,
      median,
    },
  }
}