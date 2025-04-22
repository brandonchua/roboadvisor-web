// src/app/recommendation/page.tsx
import { notFound } from 'next/navigation'
import PieChart from './PieChart'
import funds    from '../../data/funds.json'

interface RecommendationPageProps {
  searchParams: { weights?: string }
}

export default function RecommendationPage({ searchParams }: RecommendationPageProps) {
  // 1. Grab the raw JSON string from the URL
  const raw = searchParams.weights ?? '[]'

  // 2. Try to parse it into an array of numbers
  let weights: number[]
  try {
    const parsed = JSON.parse(raw)
    if (
      !Array.isArray(parsed) ||
      !parsed.every((x) => typeof x === 'number')
    ) {
      throw new Error('invalid weights')
    }
    weights = parsed
  } catch {
    // If parsing fails, show a 404
    return notFound()
  }

  // 3. Convert to percent values for display
  const pct = weights.map((w) => Math.round(w * 10000) / 100)
  const labels = funds.map((f) => f.name)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Portfolio Recommendation</h1>
      <p className="mb-6 text-gray-700">
        Based on your responses, here’s your suggested asset allocation:
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* PieChart is a client component (it begins with "use client") */}
        <PieChart labels={labels} data={pct} />

        {/* Static server‑rendered table */}
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