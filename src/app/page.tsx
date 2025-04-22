// src/app/page.tsx
import Link from "next/link";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function Home() {
  return (
    <Container className="py-5">
      {/* Hero */}
      <Card bg="light" className="text-center mb-5 shadow-sm">
        <Card.Body className="py-5">
          <Card.Title as="h1" className="display-4 mb-3">
            RoboAdvisor
          </Card.Title>
          <Card.Text className="lead mb-4">
            Mean‑variance portfolio builder powered by academic rigor and real‑
            world data. Answer a few quick questions to craft an investment mix
            tailored just for you.
          </Card.Text>
          <Link href="/questionnaire" passHref>
            <Button size="lg" variant="primary">
              Start the Survey →
            </Button>
          </Link>
        </Card.Body>
      </Card>

      {/* Project Objectives */}
      <h2 className="mb-3">Project Objectives</h2>
      <Row className="mb-5">
        {[
          {
            title: "Educate",
            text: "Demystify Modern Portfolio Theory for everyday investors.",
          },
          {
            title: "Customize",
            text: "Translate your goals and risk appetite into data‑driven portfolios.",
          },
          {
            title: "Visualize",
            text: "See your Optimal Portfolio & Efficient Frontier plotted clearly.",
          },
        ].map((obj) => (
          <Col md={4} key={obj.title} className="mb-3">
            <Card className="h-100 text-center shadow-sm">
              <Card.Body>
                <Card.Title>{obj.title}</Card.Title>
                <Card.Text>{obj.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Credits */}
      <Card className="text-center mb-5 border-0">
        <Card.Body>
          <small className="text-muted">
            Developed under the guidance of{" "}
            <strong>Prof. Lee Hong Sing</strong> (BMD5302 Financial Modeling).  
            A big thank‑you for his expertise and mentorship!
          </small>
        </Card.Body>
      </Card>

      {/* Team */}
      <h2 className="mb-3">Meet the Team</h2>
      <Row className="gy-4 text-center mb-5">
        {[
          "Brandon Chua",
          "Claudia Anna Maria Nori",
          "Jong Zhi Kai",
          "Kitahara Yutaro",
          "Wang Xinyao",
        ].map((name) => (
          <Col sm={6} lg={4} key={name}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Text className="mb-0">{name}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Footer CTA */}
      <div className="text-center">
        <Link href="/questionnaire" passHref>
          <Button variant="outline-primary" size="lg">
            Begin Your Personalized Survey
          </Button>
        </Link>
      </div>
    </Container>
  );
}