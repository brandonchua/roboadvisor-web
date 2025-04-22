'use client'

import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface PieChartProps {
  labels: string[]
  data: number[]
}

export default function PieChart({ labels, data }: PieChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <Pie
        data={{
          labels,
          datasets: [{
            label: 'Allocation (%)',
            data,
            backgroundColor: [
              '#E57373','#FFB74D','#FFF176','#81C784','#4DB6AC',
              '#64B5F6','#7986CB','#BA68C8','#A1887F','#90A4AE'
            ],
            borderColor: '#fff',
            borderWidth: 2,
          }]
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
          }
        }}
      />
    </div>
  )
}