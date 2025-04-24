'use client';

import Image from 'next/image';
import { Container, Row, Col, Card } from 'react-bootstrap';

const team = [
  'Brandon Chua Chi Yan',
  'Claudia Anna Maria Nori',
  'Jong Zhi Kai',
  'Kitahara Yutaro',
  'Wang Xinyao',
];

export default function AboutPage() {
  return (
    <Container className="py-8">
      <h1 className="text-center mb-5">Meet the FinCow Team</h1>
      <Row className="g-4 justify-content-center">
        {team.map((name) => (
          <Col key={name} xs={12} sm={6} md={4} lg={3}>
            <Card className="text-center border-0 shadow-sm h-100">
              <div className="mx-auto mt-4" style={{ width: 128, height: 128, position: 'relative' }}>
                <Image
                  src="/images/FinCowLogo.png"
                  alt={name}
                  fill
                  sizes="128px"
                  style={{ objectFit: 'cover', borderRadius: '50%' }}
                />
              </div>
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text className="text-muted">
                  {/* Role or Fun Fact here */}
                  FinCow Enthusiast
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card bg="light" className="mt-5 p-4 border-0">
        <Card.Body>
          <Card.Title as="h2">About FinCow</Card.Title>
          <Card.Text>
            FinCow is a student‑built robo‑advisor designed to help everyday investors
            balance risk and return. Our tool leverages mean‑variance optimization,
            real‑world fund data, and a friendly interface so you can create a portfolio
            that truly reflects your goals and risk appetite.
          </Card.Text>
          <Card.Text>
            We are NUS Masters of Digital Financial Technologies students passionate about making sophisticated financial models
            approachable. This project is developed under the guidance of Prof. Lee Hong Sing.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}
