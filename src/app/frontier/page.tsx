// src/app/frontier/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Line }                   from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { inv, multiply, dot }     from 'mathjs';
import funds                      from '../../data/funds.json';
import cov                        from '../../data/varcov.json';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TRADING_DAYS = 252;

export default function Frontier() {
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    // Convert daily data to annual
    const muDaily = (funds as { avgReturn: number }[]).map(f => f.avgReturn);
    const mu = muDaily.map(r => r * TRADING_DAYS);
    const Σ  = (cov as number[][]).map(row => row.map(v => v * TRADING_DAYS));

    // Precompute Σ⁻¹ and scalars for the closed‐form frontier
    const Σi = inv(Σ) as number[][];
    const ones = Array(mu.length).fill(1);
    const A = dot(ones, multiply(Σi, mu)) as number;
    const B = dot(mu,   multiply(Σi, mu)) as number;
    const C = dot(ones, multiply(Σi, ones)) as number;
    const D = B*C - A*A;

    // Build target return grid
    const minR = Math.min(...mu), maxR = Math.max(...mu);
    const steps = 10;
    const Rs = Array.from({ length: steps+1 }, (_, i) => 
      minR + (maxR - minR) * (i/steps)
    );

    // Compute (σ, R) points
    const points = Rs.map(R => {
      // numerator = Σ⁻¹ [μ(C·R − A) + 1(B − A·R)]
      const term1 = mu.map(m => m * (C*R - A));
      const term2 = ones.map(_ => (B - A*R));
      const raw   = multiply(Σi, term1.map((v,i) => v + term2[i])) as number[];
      const w     = raw.map(v => v / D);

      // variance = wᵀ Σ w
      const variance = dot(w, multiply(Σ, w)) as number;
      return { x: Math.sqrt(variance) * 100, y: R * 100 };
    });

    setPts(points);
  }, []);

  return (
    <div>
      <h2 className="mb-3">Efficient Frontier</h2>
      <Line
        data={{
          datasets: [{
            label: 'EF',
            data: pts,
            parsing: { xAxisKey: 'x', yAxisKey: 'y' },
            borderColor: 'rgb(33,150,243)',
            backgroundColor: 'rgba(33,150,243,0.2)',
            showLine: true,
            pointRadius: 4
          }]
        }}
        options={{
          responsive: true,
          scales: {
            x: { title: { display: true, text: 'Std Dev (Annual %)' } },
            y: { title: { display: true, text: 'Return (Annual %)' } }
          },
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Efficient Frontier (Annual %)' }
          }
        }}
      />
    </div>
  );
}