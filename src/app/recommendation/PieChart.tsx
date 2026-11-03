'use client'

import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip)

// Allocation palette, tuned for the #171717 panel (distinct in lightness as well as hue).
export const ALLOC_COLORS = ['#e2a91a', '#6cb6ff', '#3fb950', '#f0716a', '#c297ff', '#f3c64d', '#56d4c8', '#ff9f5a', '#9aa6b2', '#e88fc7']

interface PieChartProps {
  labels: string[]
  data: number[]
}

export default function PieChart({ labels, data }: PieChartProps) {
  return (
    <Doughnut
      data={{
        labels,
        datasets: [{ label: 'Allocation (%)', data, backgroundColor: ALLOC_COLORS, borderColor: '#171717', borderWidth: 2, hoverOffset: 6 }],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0b0b0b', borderColor: '#333', borderWidth: 1, titleColor: '#ece9e2', bodyColor: '#ece9e2',
            callbacks: { label: (ctx) => ` ${Number(ctx.parsed).toFixed(2)}%` },
          },
        },
      }}
    />
  )
}
