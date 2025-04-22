// src/app/page.tsx
'use client';

import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Row       from 'react-bootstrap/Row';
import Col       from 'react-bootstrap/Col';
import Card      from 'react-bootstrap/Card';
import Button    from 'react-bootstrap/Button';
import { FaChartLine, FaCogs, FaPalette } from 'react-icons/fa';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Container fluid className="bg-primary text-white text-center py-5 mb-5">
        <h1 className="display-3 fw-bold">RoboAdvisor</h1>
        <p className="lead mb-4">
          Mean‑variance portfolio builder powered by academic rigor & real‑world data.
        </p>
        <Link href="/questionnaire" passHref>
          <Button size="lg" variant="light">Start Your Personalized Survey</Button>
        </Link>
      </Container>

      <Container>
        {/* Objectives */}
        <h2 className="mb-4 text-center">What You’ll Do</h2>
        <Row className="g-4 mb-5">
          {[
            {
              icon: <FaChartLine size={32} className="text-primary mb-3" />,
              title: 'Educate',
              text: 'Demystify Modern Portfolio Theory for everyday investors.',
            },
            {
              icon: <FaCogs size={32} className="text-success mb-3" />,
              title: 'Customize',
              text: 'Translate your goals & risk appetite into a data‑driven portfolio.',
            },
            {
              icon: <FaPalette size={32} className="text-warning mb-3" />,
              title: 'Visualize',
              text: 'See your Optimal Portfolio & Efficient Frontier plotted clearly.',
            },
          ].map((o) => (
            <Col md={4} key={o.title}>
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body>
                  {o.icon}
                  <Card.Title className="fw-bold">{o.title}</Card.Title>
                  <Card.Text>{o.text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Credits */}
        <Card bg="light" className="py-3 mb-5 border-0">
          <Card.Body className="text-center">
            <small className="text-muted">
              Developed under the guidance of <strong>Prof. Lee Hong Sing</strong> 
              (BMD5302 Financial Modeling). Huge thanks for his expertise & mentorship!
            </small>
          </Card.Body>
        </Card>

        {/* Team */}
        <h2 className="mb-4 text-center">Meet the Team</h2>
        <Row className="g-4 mb-5 justify-content-center">
          {[
            'Brandon Chua',
            'Claudia Anna Maria Nori',
            'Jong Zhi Kai',
            'Kitahara Yutaro',
            'Wang Xinyao',
          ].map((name) => (
            <Col xs={6} sm={4} md={2} key={name}>
              <Card className="text-center border-0 shadow-sm py-3">
                <Card.Body>
                  <Card.Text className="fw-medium">{name}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Call‑to‑Action */}
        <div className="text-center mb-5">
          <Link href="/questionnaire" passHref>
            <Button size="lg" variant="outline-primary" className="px-5">
              Begin Your Personalized Survey
            </Button>
          </Link>
        </div>
      </Container>
    </>
  );
}