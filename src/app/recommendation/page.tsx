// src/app/recommendation/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter }          from 'next/navigation'
import PieChart               from './PieChart'
import funds                  from '../../data/funds.json'
import { getRiskProfile }     from '../../lib/risk'

interface ApiResponse {
  aversion: number
  weights:  number[]
  stats: {
    return:    number
    stdDev:    number
    utility:   number
    bestCase:  number
    worstCase: number
    median:    number
  }
}

export default function RecommendationPage() {
  const router = useRouter()
  const [data, setData]   = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const raw    = params.get('answers')
    if (!raw) {
      router.replace('/questionnaire')
      return
    }

    let answers: Record<string, any>
    try {
      answers = JSON.parse(raw)
    } catch {
      router.replace('/questionnaire')
      return
    }

    fetch('/api/optimize', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(answers),
    })
      .then(r => {
        if (!r.ok) throw new Error(`Status ${r.status}`)
        return r.json() as Promise<ApiResponse>
      })
      .then(setData)
      .catch(() => setError('Failed to load recommendation.'))
  }, [router])

  if (error) return <div className="p-8 text-red-500">{error}</div>
  if (!data)  return <div className="p-8 text-gray-500">Loading…</div>

  const { aversion, weights, stats } = data
  const { profile, description }     = getRiskProfile(aversion)
  const allocations                   = weights.map(w => +(w * 100).toFixed(2))
  const labels                        = funds.map(f => f.name)

  return (
    <div className="space-y-12 px-4 py-8 lg:px-16">

      {/* header */}
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Portfolio Recommendation</h1>
        <p className="text-gray-600">
          Risk Aversion: <strong>{aversion}</strong> — <em>{profile}</em> ({description})
        </p>
      </header>

      {/* full-width pie chart */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="w-full h-[400px]">
          <PieChart
            labels={labels}
            data={allocations}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12 } }
              }
            }}
          />
        </div>
      </div>

      {/* bottom half: stats + table side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* key statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Key Statistics</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Portfolio Return:</strong> {stats.return.toFixed(5)}</li>
            <li><strong>Standard Deviation:</strong> {stats.stdDev.toFixed(5)}</li>
            <li><strong>Utility:</strong> {stats.utility.toFixed(5)}</li>
            <li><strong>Best-Case Return:</strong> {stats.bestCase.toFixed(5)}</li>
            <li><strong>Worst-Case Return:</strong> {stats.worstCase.toFixed(5)}</li>
            <li><strong>Median Return:</strong> {stats.median.toFixed(5)}</li>
          </ul>
        </div>

        {/* allocation table */}
        <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">Allocation Breakdown</h2>
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fund Name</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Avg Return (%)</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Allocation (%)</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((f, i) => (
                <tr key={f.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 text-sm text-gray-800">{f.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-800 text-right">
                    {(f.avgReturn * 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 text-right">
                    {allocations[i].toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}