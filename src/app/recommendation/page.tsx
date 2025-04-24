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
    if (!raw) return void router.replace('/questionnaire')

    let answers: Record<string, any>
    try {
      answers = JSON.parse(raw)
    } catch {
      return void router.replace('/questionnaire')
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
      .catch(err => {
        console.error(err)
        setError('Failed to load recommendation.')
      })
  }, [router])

  if (error) return <div className="p-8 text-red-500">{error}</div>
  if (!data)  return <div className="p-8 text-gray-500">Loading…</div>

  const { aversion, weights, stats } = data
  const { profile, description }     = getRiskProfile(aversion)
  const allocations                   = weights.map(w => +(w * 100).toFixed(2))
  const labels                        = funds.map(f => f.name)

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Portfolio Recommendation</h1>
        <p className="mt-1 text-gray-600">
          Risk Aversion:{' '}
          <strong>{aversion}</strong> — <em>{profile}</em> ({description})
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* —— PIE + STATS —— */}
        <div className="space-y-6">

          {/* Chart card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* fix the height, hide any overflow (legend included) */}
            <div className="w-full h-96">
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

          {/* Stats card */}
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <h2 className="text-2xl font-semibold mb-4">Key Statistics</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>
                <strong>Portfolio Return:</strong> {stats.return.toFixed(5)}
              </li>
              <li>
                <strong>Std Deviation:</strong> {stats.stdDev.toFixed(5)}
              </li>
              <li>
                <strong>Utility:</strong> {stats.utility.toFixed(5)}
              </li>
              <li>
                <strong>Best-Case Return:</strong> {stats.bestCase.toFixed(5)}
              </li>
              <li>
                <strong>Worst-Case Return:</strong> {stats.worstCase.toFixed(5)}
              </li>
              <li>
                <strong>Median Return:</strong> {stats.median.toFixed(5)}
              </li>
            </ul>
          </div>
        </div>

        {/* —— ALLOCATION TABLE —— */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Fund Name</th>
                <th className="px-4 py-2 text-right">Avg Return (%)</th>
                <th className="px-4 py-2 text-right">Allocation (%)</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((f, i) => (
                <tr
                  key={f.name}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-2">{f.name}</td>
                  <td className="px-4 py-2 text-right">
                    {(f.avgReturn * 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right">
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