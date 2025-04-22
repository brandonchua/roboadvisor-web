// src/app/sensitivity/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { optimize } from '../../lib/portfolio';
import funds from '../../data/funds.json';
import cov from '../../data/varcov.json';
import { Form } from 'react-bootstrap';

export default function Sensitivity() {
  const [A, setA] = useState(5);
  const [weights, setWeights] = useState<number[]>([]);

  useEffect(() => {
    const mu = (funds as { avgReturn: number }[]).map(f => f.avgReturn);
    setWeights(optimize(mu, cov as number[][], A));
  }, [A]);

  return (
    <>
      <h2>What‑If: Risk Aversion</h2>
      <Form.Group controlId="sliderA">
        <Form.Label>Risk Aversion (A): {A}</Form.Label>
        <Form.Range
          min={1}
          max={15}
          value={A}
          onChange={e => setA(+e.target.value)}
        />
      </Form.Group>

      <Line
        data={{
          labels: funds.map((_,i) => `F${i+1}`),
          datasets: [{
            label: 'Weight (%)',
            data: weights.map(w => w*100),
            borderColor: 'rgb(76,175,80)',
            fill: false,
            tension: 0.2
          }]
        }}
        options={{ scales:{ y:{ beginAtZero:true } } }}
      />
    </>
  );
}