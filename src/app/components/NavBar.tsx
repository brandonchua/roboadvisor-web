'use client';

import Link      from 'next/link';
import Navbar    from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav       from 'react-bootstrap/Nav';

export default function NavBar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand as={Link} href="/">RoboAdvisor</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/questionnaire" className="mx-3 py-2 fs-5">
              Survey
            </Nav.Link>
            <Nav.Link as={Link} href="/universe" className="mx-3 py-2 fs-5">
              Fund Universe
            </Nav.Link>
            <Nav.Link as={Link} href="/recommendation" className="mx-3 py-2 fs-5">
              Recommendation
            </Nav.Link>
            <Nav.Link as={Link} href="/what-if" className="mx-3 py-2 fs-5">
              What-If
            </Nav.Link>
            <Nav.Link as={Link} href="/about" className="mx-3 py-2 fs-5">
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}