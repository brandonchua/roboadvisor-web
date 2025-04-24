// src/app/components/NavBar.tsx
'use client'

import Link      from 'next/link'
import Image     from 'next/image'
import { Navbar, Container, Nav } from 'react-bootstrap'

export default function NavBar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container fluid className="items-center">
        {/* Logo + brand */}
        <Navbar.Brand as={Link} href="/" className="flex items-center">
          <Image
            src="/images/FinCowLogo.png"
            alt="FinCow Logo"
            width={64}
            height={64}
            style={{ objectFit: 'contain' }}
          />
          <span className="ms-2 text-white fw-bold">FinCow</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/questionnaire">Survey</Nav.Link>
            <Nav.Link as={Link} href="/universe">Fund Universe</Nav.Link>
            <Nav.Link as={Link} href="/recommendation">Recommendation</Nav.Link>
            <Nav.Link as={Link} href="/about">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}