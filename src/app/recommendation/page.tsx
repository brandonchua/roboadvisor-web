// src/app/recommendation/page.tsx
import React from 'react'
import { notFound } from 'next/navigation'
import PieChart from './PieChart'
import funds from '../../data/funds.json'    // your 10‑element fund list

interface RecommendationPageProps {
  searchParams: { weights?: string }
}

export default function RecommendationPage({ searchParams }: RecommendationPageProps) {
  // parse the weights JSON from URL
  let weights: number[] = []
  try {
    const raw = searchParams.weights || '[]'
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'number')) {
      weights = parsed
    } else {
      throw new Error('bad array')
    }
  } catch {
    // if something went wrong, show 404 or fallback:
    return notFound()
  }

  // prepare two‐decimal percentages for chart + table
  const pct = weights.map(w => Math.round(w * 10000) / 100)
  const labels = funds.map(f => f.name)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Portfolio Recommendation</h1>
      <p className="mb-6 text-gray-700">
        Based on your responses, here’s your suggested asset allocation:
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* CLIENT‐ONLY PIE */}
        <PieChart labels={labels} data={pct} />

        {/* SERVER‐ONLY TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Fund Name</th>
                <th className="px-4 py-2 text-right">Allocation (%)</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((f, i) => (
                <tr key={f.name} className={i % 2 ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-2">{f.name}</td>
                  <td className="px-4 py-2 text-right">{pct[i].toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}