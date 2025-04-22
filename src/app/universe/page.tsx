// src/app/universe/page.tsx
'use client';
import funds from '../../data/funds.json';
import cov from '../../data/varcov.json';
import { Table } from 'react-bootstrap';

export default function Universe() {
  return (
    <>
      <h2>Fund Universe</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Avg. Return</th>
            <th>Std. Dev.</th>
          </tr>
        </thead>
        <tbody>
          {funds.map((f, i) => (
            <tr key={i}>
              <td>{i+1}</td>
              <td>{f.name}</td>
              <td>{(f.avgReturn*252).toFixed(2)}%</td>
              <td>{Math.sqrt(cov[i][i]*252).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}