// src/app/components/NavBar.tsx
'use client'

import Link      from 'next/link'
import { Navbar, Container, Nav } from 'react-bootstrap'

export default function NavBar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand as={Link} href="/">
          RoboAdvisor
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/questionnaire">Survey</Nav.Link>
            <Nav.Link as={Link} href="/universe">Fund Universe</Nav.Link>
            <Nav.Link as={Link} href="/recommendation">Recommendation</Nav.Link>
            <Nav.Link as={Link} href="/what-if">What-If</Nav.Link>
            <Nav.Link as={Link} href="/about">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}