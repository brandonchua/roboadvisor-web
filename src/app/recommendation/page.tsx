// src/app/recommendation/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter }          from 'next/navigation'
import PieChart               from './PieChart'
import funds                  from '../../data/funds.json'
import { getProfileForA }     from '../../lib/risk'

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
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`)
        return res.json() as Promise<ApiResponse>
      })
      .then(json => setData(json))
      .catch(() => setError('Failed to load recommendation.'))
  }, [router])

  if (error) return <div className="p-8 max-w-2xl mx-auto text-red-600">{error}</div>
  if (!data)  return <div className="p-8 max-w-2xl mx-auto text-gray-500">Loading…</div>

  const { aversion, weights, stats } = data
  const { profile, description }     = getProfileForA(aversion)
  const allocations                   = weights.map(w => +(w * 100).toFixed(2))
  const labels                        = funds.map(f => f.name)

  return (
    <div className="space-y-12 px-6 py-8 max-w-6xl mx-auto">
      {/* header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold">Portfolio Recommendation</h1>
        <p className="mt-1 text-gray-600">
          Risk Aversion: <strong>{aversion}</strong> — <em>{profile}</em> ({description})
        </p>
      </div>

      {/* two‐column layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT column: Pie + Stats */}
        <div className="space-y-6">
          {/* Pie chart */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-4">
            <div className="h-128">
              <PieChart
                labels={labels}
                data={allocations}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12,
                        filter: (item, chart) => {
                          const v = chart.data.datasets?.[0].data?.[item.index]
                          return typeof v === 'number' && v > 0
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Key statistics */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Key Statistics</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Portfolio Return:</strong> {(stats.return * 100).toFixed(2)}%
              </li>
              <li>
                <strong>Std Deviation:</strong> {(stats.stdDev * 100).toFixed(2)}%
              </li>
              <li>
                <strong>Utility:</strong> {stats.utility.toFixed(5)}
              </li>
              <li>
                <strong>Best-Case Return:</strong> {(stats.bestCase * 100).toFixed(2)}%
              </li>
              <li>
                <strong>Worst-Case Return:</strong> {(stats.worstCase * 100).toFixed(2)}%
              </li>
              <li>
                <strong>Median Return:</strong> {(stats.median * 100).toFixed(2)}%
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT column: Allocation + News */}
        <div className="space-y-6">
          {/* Allocation breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4">Allocation Breakdown</h2>
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Fund Name</th>
                  <th className="px-4 py-2 text-right">Avg Return (%)</th>
                  <th className="px-4 py-2 text-right">Allocation (%)</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((f, i) => (
                  <tr key={f.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2">{f.name}</td>
                    <td className="px-4 py-2 text-right">{(f.avgReturn * 100).toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">{allocations[i].toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100 font-semibold">
                <tr>
                  <td className="px-4 py-2">Total</td>
                  <td />
                  <td className="px-4 py-2 text-right">
                    {allocations.reduce((sum, x) => sum + x, 0).toFixed(2)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Latest fund news */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Latest Fund News</h2>
            <ul className="space-y-2">
              <li>
                <a href="https://www.reuters.com/markets/us/tech-shares-focus-investors-eye-latest-filings-funds-2024-08-14/" target="_blank" rel="noopener">
                  Tech shares in focus as investors eye latest filings from funds (Reuters)
                </a>
              </li>
              <li>
                <a href="https://www.axios.com/2025/02/07/sustainable-investing-outflows" target="_blank" rel="noopener">
                  The heyday of sustainable investing is over (Axios)
                </a>
              </li>
              <li>
                <a href="https://www.ft.com/content/2c8258ba-f7ab-4bd1-8c0c-e25b871812f4" target="_blank" rel="noopener">
                  Investors in clean energy funds backtrack as rates and Donald Trump cloud outlook (Financial Times)
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}