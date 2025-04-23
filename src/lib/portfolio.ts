import qp from 'quadprog'

/**
 * Long-only mean–variance optimizer:
 *
 *   maximize    wᵀμ − (A/2)·wᵀΣw
 *   subject to  ∑ᵢ wᵢ = 1
 *                wᵢ ≥ 0  for all i
 *
 * Quadprog solves:
 *   minimize  ½ wᵀ Dmat w  −  dvecᵀ w
 * subject to  Amatᵀ w ≥ bvec
 *
 * To get  maximize [ wᵀμ − (A/2) wᵀΣw ], we set:
 *   Dmat = A·Σ
 *   dvec = μ        (so that −dvecᵀ w = −μᵀw)
 *
 * And our constraints are:
 *   • equality   1ᵀw = 1
 *   • inequality w ≥ 0
 */
export function optimizeLongOnly(
  mu: number[],
  cov: number[][],
  A: number
): number[] {
  const n = mu.length

  // 1) Quadratic term: A·Σ
  const Dmat = cov.map(row => row.map(val => val * A))

  // 2) Linear term: μ
  const dvec = mu.slice()

  // 3) Build constraint rows: sum-to-one + identity rows
  const eqRow = Array(n).fill(1)
  const ineqRows = Array.from({ length: n }, (_, i) => {
    const r = Array(n).fill(0)
    r[i] = 1
    return r
  })

  // 4) Transpose into columns for quadprog
  const allRows = [eqRow, ...ineqRows]
  const Amat = allRows[0].map((_, col) =>
    allRows.map(row => row[col])
  )

  // 5) RHS vector: first = 1 (equality), then zeros
  const bvec = [1, ...Array(n).fill(0)]

  // 6) Number of equalities
  const meq = 1

  // 7) Solve
  const result = qp.solveQP(Dmat, dvec, Amat, bvec, meq)

  // 8) Extract solution array
  const rawW: any = Array.isArray(result)
    ? result
    : (result as any).solution

  if (!Array.isArray(rawW) || rawW.length !== n) {
    console.error('🚨 quadprog failed to return a valid solution:', result)
    // fallback: equal-weight
    return Array(n).fill(1 / n)
  }

  // 9) Clamp negatives/NaN → 0, then renormalize to sum=1
  const cleaned = rawW.map(w =>
    typeof w === 'number' && isFinite(w) && w > 0 ? w : 0
  )
  const total = cleaned.reduce((sum, x) => sum + x, 0) || 1

  return cleaned.map(w => w / total)
}

/**
 * Alias for backward-compatibility
 */
export const optimize = optimizeLongOnly
