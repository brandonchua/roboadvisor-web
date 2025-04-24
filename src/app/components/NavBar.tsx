// src/app/components/NavBar.tsx
'use client'

import Link  from 'next/link'
import Image from 'next/image'
import { Navbar, Container, Nav } from 'react-bootstrap'

export default function NavBar() {
  return (
    <Navbar bg="primary" variant="dark" className="mb-4">
      <Container fluid className="d-flex align-items-center">
        {/* Logo + brand */}
        <Navbar.Brand
          as={Link}
          href="/"
          className="d-flex align-items-center"
        >
          <Image
            src="/images/FinCowLogo.png"
            alt="FinCow Logo"
            width={40}
            height={40}
            style={{ objectFit: 'contain' }}
          />
          <span className="ms-2 text-white fw-bold">FinCow</span>
        </Navbar.Brand>

        {/* All links live in a single Nav, always shown */}
        <Nav className="ms-auto">
          <Nav.Link as={Link} href="/questionnaire">
            Survey
          </Nav.Link>
          <Nav.Link as={Link} href="/universe">
            Fund Universe
          </Nav.Link>
          <Nav.Link as={Link} href="/recommendation">
            Recommendation
          </Nav.Link>
          <Nav.Link as={Link} href="/about">
            About
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}