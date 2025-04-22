'use client';

import Card from 'react-bootstrap/Card';

const team = [
  'Brandon Chua Chi Yan',
  'Claudia Anna Maria Nori',
  'Jong Zhi Kai',
  'Kitahara Yutaro',
  'Wang Xinyao',
];

export default function AboutPage() {
  return (
    <Card className="mt-6">
      <Card.Body>
        <Card.Title as="h2">Production Team</Card.Title>
        <ul className="list-disc pl-5">
          {team.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
}