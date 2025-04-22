// src/app/recommendation/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import funds from '../../data/funds.json';
import { Table, Row, Col, Card } from 'react-bootstrap';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Recommendation() {
  const params = useSearchParams();
  const weights = useMemo(() => {
    const raw = params.get('weights');
    if (!raw) return [];
    try {
      return JSON.parse(raw) as number[];
    } catch {
      return [];
    }
  }, [params]);

  // Combine names + percentages
  const tableData = useMemo(() => {
    return funds.map((f, i) => ({
      name: f.name,
      pct: weights[i] != null ? +(weights[i]*100).toFixed(2) : 0
    }));
  }, [weights]);

  // Pie chart data
  const pieData = {
    labels: tableData.map(r => r.name),
    datasets: [{
      data: tableData.map(r => r.pct),
      backgroundColor: [
        '#d32f2f','#ffa000','#cddc39','#8bc34a','#4caf50',
        '#009688','#2196f3','#673ab7','#e91e63','#f06292'
      ]
    }]
  };

  return (
    <Card className="p-4">
      <h2 className="mb-3">Portfolio Recommendation</h2>
      <p>Based on your responses, here’s your suggested asset allocation:</p>
      <Row>
        {/* Pie */}
        <Col md={6}>
          <Pie data={pieData} />
        </Col>

        {/* Table */}
        <Col md={6}>
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>Fund Name</th>
                <th className="text-end">Allocation %</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td className="text-end">{r.pct.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Card>
  );
}