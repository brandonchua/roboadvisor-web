// src/lib/portfolio.ts

import { inv, multiply } from 'mathjs';
import * as qp from 'quadprog';

/**
 * Mean–variance optimizer with risk aversion A:
 *
 *   maximize wᵀμ − (A/2)·wᵀΣw
 *   subject to 1ᵀw = 1
 *
 * Closed‐form KKT solution:
 *   let invΣ = Σ⁻¹
 *       invMu  = invΣ · μ
 *       invOne = invΣ · 1
 *       b = 1ᵀ invMu
 *       c = 1ᵀ invOne
 *       λ = (A − b) / c
 *   then w = (1/A)·invMu + (λ/A)·invOne
 *
 * @param mu  expected returns (length n)
 * @param cov covariance matrix n×n
 * @param A   risk aversion scalar (>0)
 * @returns   portfolio weights summing to 1
 */
export function optimize(
  mu: number[],
  cov: number[][],
  A: number
): number[] {
  const n = mu.length;
  const one = Array(n).fill(1);

  // Σ⁻¹
  const invSigma = inv(cov) as number[][];

  // Σ⁻¹ μ  and  Σ⁻¹ 1
  const invMu  = multiply(invSigma, mu)  as number[];
  const invOne = multiply(invSigma, one) as number[];

  // b = 1ᵀ Σ⁻¹ μ
  const b = invMu.reduce((sum, w) => sum + w, 0);

  // c = 1ᵀ Σ⁻¹ 1
  const c = invOne.reduce((sum, w) => sum + w, 0);

  // λ from equality constraint 1ᵀw = 1
  const λ = (A - b) / c;

  // w = (1/A)·invMu + (λ/A)·invOne
  return invMu.map((w_i, i) =>
    (w_i + λ * invOne[i]) / A
  );
}


/**
 * Minimum‐variance portfolio for given target return R:
 *   minimize wᵀΣw
 *   subject to μᵀw = R,  1ᵀw = 1
 *
 * Translates into quadprog.js call:
 *   min (1/2) wᵀΣw + 0ᵀw
 *   s.t.  Aᵀw = b
 *
 * @param mu  expected returns vector (length n)
 * @param cov covariance matrix (n×n)
 * @param R   target portfolio return
 * @returns   weight vector w of length n
 */
export function optimizeR(
  mu: number[],
  cov: number[][],
  R: number
): number[] {
  const n = mu.length;

  // Quadratic term (covariance)
  const Dmat = cov;

  // Linear term = zero
  const dvec = Array(n).fill(0);

  // Constraints matrix: [μ; 1] columns
  const Amat = [
    mu,
    Array(n).fill(1),
  ];

  // RHS for [μᵀw = R; 1ᵀw = 1]
  const bvec = [R, 1];

  const meq = 2; // two equality constraints

  const result = qp.solveQP(Dmat, dvec, Amat, bvec, meq);
  return result.solution as number[];
}