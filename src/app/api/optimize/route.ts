import { NextRequest, NextResponse } from 'next/server'
import { computeRiskAversion }      from '../../../lib/risk'

interface Stats {
  return:    number   // daily
  stdDev:    number   // daily
  utility:   number
  bestCase:  number   // daily
  worstCase: number   // daily
  median:    number   // daily
}

interface AnnualStats {
  annualReturn:     number
  annualVolatility: number
  bestCaseAnn:      number
  worstCaseAnn:     number
  medianAnn:        number
}

const buckets: Record<number, { weights: number[]; stats: Stats }> = {
  1: {
    weights: [0.04103, 0, 0.64172, 0, 0.31521, 0, 0, 0.04306, 0, 0],
    stats: {
      return:    0.15815,
      stdDev:    0.46672,
      utility:   0.04924,
      bestCase:  1.09159,
      worstCase: -0.77528,
      median:    0.15815,
    },
  },
  3: {
    weights: [0.17088, 0, 0.04103, 0, 0.36456, 0.12032, 0, 0.12802, 0, 0.17519],
    stats: {
      return:    0.09347,
      stdDev:    0.36960,
      utility:  -0.11144,
      bestCase:  0.83266,
      worstCase: -0.64573,
      median:    0.09347,
    },
  },
  5: {
    weights: [0.04809, 0, 0.08651, 0, 0.35186, 0.16228, 0, 0.11710, 0, 0.18470],
    stats: {
      return:    0.07415,
      stdDev:    0.35573,
      utility:  -0.24220,
      bestCase:  0.78560,
      worstCase: -0.63730,
      median:    0.07415,
    },
  },
  7: {
    weights: [0, 0, 0.17088, 0, 0.36456, 0.12032, 0, 0.12802, 0, 0.17519],
    stats: {
      return:    0.06482,
      stdDev:    0.35116,
      utility:  -0.36677,
      bestCase:  0.76714,
      worstCase: -0.63750,
      median:    0.06482,
    },
  },
  10: {
    weights: [0.10118, 0, 0, 0.09797, 0.33579, 0.17538, 0, 0.10111, 0, 0.18858],
    stats: {
      return:    0.06272,
      stdDev:    0.35043,
      utility:  -0.55130,
      bestCase:  0.76359,
      worstCase: -0.63814,
      median:    0.06272,
    },
  },
}

export async function POST(req: NextRequest) {
  let answers: Record<string, any>
  try {
    answers = (await req.json()) as Record<string, any>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // 1) compute A
  const A = computeRiskAversion(answers)

  // 2) pull raw bucket (fallback to 1)
  const raw  = buckets[A]?.weights  ?? buckets[1].weights
  const stats = buckets[A]?.stats    ?? buckets[1].stats

  // 3) normalize weights so they sum to exactly 1
  const sum = raw.reduce((a, x) => a + x, 0)
  const weights = raw.map(w => w / sum)

  // 4) annualize stats: annual = (1 + daily)^252 - 1 ; volatility * sqrt(252)
  const annualReturn     = (1 + stats.return) ** 252 - 1
  const annualVolatility = stats.stdDev * Math.sqrt(252)
  const bestCaseAnn      = stats.bestCase * Math.sqrt(252)
  const worstCaseAnn     = stats.worstCase * Math.sqrt(252)
  const medianAnn        = stats.median * Math.sqrt(252)

  const annualStats: AnnualStats = {
    annualReturn,
    annualVolatility,
    bestCaseAnn,
    worstCaseAnn,
    medianAnn,
  }

  return NextResponse.json({
    aversion:     A,
    weights:      weights.map(w => +w.toFixed(5)),
    stats,
    annualStats,
  })
}