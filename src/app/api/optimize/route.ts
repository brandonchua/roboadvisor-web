// src/app/api/optimize/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { computeRiskAversion }      from '../../../lib/risk'

interface Stats {
  return:    number
  stdDev:    number
  utility:   number
  bestCase:  number
  worstCase: number
  median:    number
}

const buckets: Record<number, { weights: number[]; stats: Stats }> = {
  1: {
    // raw (may not sum exactly to 1)
    weights: [0.04103, 0, 0.64172, 0, 0.31521, 0, 0, 0.04306, 0, 0],
    stats: {
      return:    0.000640,
      stdDev:    0.030301,
      utility:   0.000181,
      bestCase:  0.061242,
      worstCase: -0.059961,
      median:    0.000640,
    },
  },
  3: {
    weights: [0.17088, 0, 0.04103, 0, 0.36456, 0.12032, 0, 0.12802, 0, 0.17519],
    stats: {
      return:    0.000308,
      stdDev:    0.022652,
      utility:  -0.000462,
      bestCase:  0.045612,
      worstCase: -0.044997,
      median:    0.000308,
    },
  },
  5: {
    weights: [0.04809, 0, 0.08651, 0, 0.35186, 0.16228, 0, 0.11710, 0, 0.18470],
    stats: {
      return:    0.000310,
      stdDev:    0.021611,
      utility:  -0.000857,
      bestCase:  0.043532,
      worstCase: -0.042911,
      median:    0.000310,
    },
  },
  7: {
    weights: [0, 0, 0.17088, 0, 0.36456, 0.12032, 0, 0.12802, 0, 0.17519],
    stats: {
      return:    0.000358,
      stdDev:    0.022388,
      utility:  -0.001396,
      bestCase:  0.045133,
      worstCase: -0.044417,
      median:    0.000358,
    },
  },
  10: {
    weights: [0.10118, 0, 0, 0.09797, 0.33579, 0.17538, 0, 0.10111, 0, 0.18858],
    stats: {
      return:    0.000258,
      stdDev:    0.022123,
      utility:  -0.002190,
      bestCase:  0.044504,
      worstCase: -0.043989,
      median:    0.000258,
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

  // derive your aversion bucket
  const A = computeRiskAversion(answers)
  console.log(`[API /optimize] computed A =`, A)

  // fetch raw bucket
  const raw = buckets[A]?.weights ?? buckets[1].weights
  const stats = buckets[A]?.stats  ?? buckets[1].stats

  // normalize so sum(raw) => 1 exactly
  const sum = raw.reduce((acc, w) => acc + w, 0)
  const weights = raw.map(w => +(w / sum).toFixed(5))

  // double-check:
  console.log('[API /optimize] normalized weights sum =', weights.reduce((a,b) => a + b, 0))

  return NextResponse.json({
    aversion: A,
    weights,
    stats,
  })
}