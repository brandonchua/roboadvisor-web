'use client';

import Image from 'next/image';
import Link  from 'next/link';
import Container from 'react-bootstrap/Container';
import Row       from 'react-bootstrap/Row';
import Col       from 'react-bootstrap/Col';
import Card      from 'react-bootstrap/Card';
import Button    from 'react-bootstrap/Button';
import { FaChartLine, FaCogs, FaPalette } from 'react-icons/fa';

export default function Home() {
  return (
    <>
      {/* Hero with Logo */}
      <Container fluid className="bg-primary text-white d-flex align-items-center py-4 mb-5">        
        {/* Title & Subtitle */}
        <div className="flex-grow-1 text-center">
          <h1 className="display-4 fw-bold">Your Friendly RoboAdvisor</h1>
          <p className="lead mb-0">
            Your cash-cow guide to building optimal portfolios<br/>
            powered by Modern Portfolio Theory & real-world fund data by NUS MFDT Students
          </p>
          <div className="ms-3 text-center">
            <Link href="/questionnaire" passHref>
              <Button size="lg" variant="light">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
        {/* CTA */}
        
      </Container>

      <Container>
        {/* Purpose */}
        <section className="mb-5">
          <h2 className="display-6 fw-bold text-center">Why FinCow?</h2>
          <p className="text-center text-muted">
            Many investors struggle to balance risk and return across global funds.  
            FinCow bridges the gap by:
          </p>
          <ul className="list-unstyled text-center fw-medium">
            <li>✅ Explaining the mechanics of mean-variance optimization</li>
            <li>✅ Tailoring a portfolio to your personal risk profile</li>
            <li>✅ Visualizing efficient frontiers, returns & volatility</li>
          </ul>
        </section>

        {/* What You’ll Do */}
        <h2 className="display-6 fw-bold text-center">What You’ll Do</h2>
        <Row className="g-4 mb-5">
          {[
            {
              icon: <FaChartLine size={32} className="text-primary mb-3" />,
              title: 'Learn',
              text: 'Understand how historical fund returns and covariances drive optimal portfolios.',
            },
            {
              icon: <FaCogs size={32} className="text-success mb-3" />,
              title: 'Customize',
              text: 'Answer a simple survey to determine your unique risk appetite.',
            },
            {
              icon: <FaPalette size={32} className="text-warning mb-3" />,
              title: 'Visualize',
              text: 'See your recommended fund allocations, expected return, and volatility.',
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
              (BMD5302 Financial Modeling).  
              Huge thanks for his expertise & mentorship!
            </small>
          </Card.Body>
        </Card>

        {/* Team */}
        <h2 className="display-6 fw-bold text-center">Meet the Team</h2>
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

        {/* Final CTA */}
        <div className="text-center mb-5">
          <Link href="/questionnaire" passHref>
            <Button size="lg" variant="outline-primary" className="px-5">
              Start Your Personalized Survey
            </Button>
          </Link>
        </div>
        <div className="text-center my-5">
          <Image
            src="/images/FinCowLogo.png"
            alt="FinCow Logo"
            width={144}
            height={144}
            priority
          />
        </div>        
      </Container>
    </>
  );
}