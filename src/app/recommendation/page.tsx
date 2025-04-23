// src/app/recommendation/page.tsx
'use client'

import { useEffect, useState } from 'react'
import PieChart               from './PieChart'
import funds                  from '../../data/funds.json'

interface ApiResponse { 
  aversion: number  
  rawScore: number  
  profile:  string  
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
  const [data, setData] = useState<ApiResponse | null>(null)

  // Fire-and-forget: POST the survey answers (stored in localStorage)
  // or however you keep them; here I assume you serialized them earlier.
  useEffect(() => {
    const stored = localStorage.getItem('surveyAnswers')
    if (!stored) return
    const answers = JSON.parse(stored)

    fetch('/api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    })
    .then(r => r.json())
    .then(setData)
  }, [])

  if (!data) {
    return <div className="h-64 flex items-center justify-center">Loading…</div>
  }

  const { aversion, rawScore, profile, weights, stats } = data
  const labels     = funds.map(f => f.name)
  const allocations = weights.map(w => +(w*100).toFixed(2))

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Portfolio Recommendation</h1>
        <p className="mt-1 text-gray-600">
          Your raw score: <strong>{rawScore}</strong> → Aversion <strong>{aversion}</strong>{' '}
          (<em>{profile}</em>)
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <PieChart labels={labels} data={allocations} />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Key Statistics</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Return:</strong> {stats.return.toFixed(5)}</li>
              <li><strong>Std Dev:</strong> {stats.stdDev.toFixed(5)}</li>
              <li><strong>Utility:</strong> {stats.utility.toFixed(5)}</li>
              <li><strong>Best Case:</strong> {stats.bestCase.toFixed(5)}</li>
              <li><strong>Worst Case:</strong> {stats.worstCase.toFixed(5)}</li>
              <li><strong>Median:</strong> {stats.median.toFixed(5)}</li>
            </ul>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Fund</th>
                <th className="px-4 py-2 text-right">Avg Ret %</th>
                <th className="px-4 py-2 text-right">Alloc %</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((f,i) => (
                <tr key={f.name} className={i%2===0?'bg-white':'bg-gray-50'}>
                  <td className="px-4 py-2">{f.name}</td>
                  <td className="px-4 py-2 text-right">
                    {(f.avgReturn*100).toFixed(2)}
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