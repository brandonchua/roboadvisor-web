// src/app/recommendation/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter }          from 'next/navigation'
import PieChart               from './PieChart'
import funds                  from '../../data/funds.json'
//import { getRiskProfile }     from '../../lib/risk'
import { getProfileForA } from '../../lib/risk'

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
  //const { profile, description }     = getRiskProfile(aversion)
  const { profile, description } = getProfileForA(aversion)
  const allocations                   = weights.map(w => +(w * 100).toFixed(2))
  const totalAlloc                    = allocations.reduce((sum, x) => sum + x, 0).toFixed(2)
  const labels                        = funds.map(f => f.name)

  return (
    <div className="space-y-12 px-6 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold">Portfolio Recommendation</h1>
        <p className="mt-1 text-gray-600">
          Risk Aversion: <strong>{aversion}</strong> — <em>{profile}</em> ({description})
        </p>
      </div>

      {/* Top Row: Pie & Allocation */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pie Chart Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-72">
            <PieChart
              labels={labels}
              data={allocations}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { boxWidth: 12, filter: (item, chart) => {
                      const v = chart.data.datasets?.[0].data?.[item.index]
                      return typeof v === 'number' && v > 0
                    }}
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Allocation Breakdown Card */}
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
                  <td className="px-4 py-2 text-right">{(f.avgReturn*100).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">{allocations[i].toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 font-semibold">
              <tr>
                <td className="px-4 py-2">Total</td>
                <td className="px-4 py-2" />
                <td className="px-4 py-2 text-right">{totalAlloc}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Bottom Row: Stats & News */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Key Statistics Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Key Statistics</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Portfolio Return:</strong> {stats.return.toFixed(5)}</li>
            <li><strong>Std Deviation:</strong> {stats.stdDev.toFixed(5)}</li>
            <li><strong>Utility:</strong> {stats.utility.toFixed(5)}</li>
            <li><strong>Best-Case Return:</strong> {stats.bestCase.toFixed(5)}</li>
            <li><strong>Worst-Case Return:</strong> {stats.worstCase.toFixed(5)}</li>
            <li><strong>Median Return:</strong> {stats.median.toFixed(5)}</li>
          </ul>
        </div>

        {/* Fund News Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Latest Fund News</h2>
          <ul className="space-y-3">
            <li>
              <a
                href="https://www.fidelity.com/fund/global-technology-news"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                Fidelity Global Technology Fund hits record high
              </a>
            </li>
            <li>
              <a
                href="https://www.schroders.com/en/insights/global/climate-change-fund-update"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                Schroder ISF Climate Change Equity sees strong inflows
              </a>
            </li>
            <li>
              <a
                href="https://www.jpmorgan.com/global-equity-select-overview"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                JPMorgan Global Select Equity updates Q1 outlook
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
