// src/app/components/NavBar.tsx
'use client'

import Link       from 'next/link'
import Navbar     from 'react-bootstrap/Navbar'
import Container  from 'react-bootstrap/Container'
import Nav        from 'react-bootstrap/Nav'
import Button     from 'react-bootstrap/Button'
import { useDebug } from '../providers/DebugProvider'

export default function NavBar() {
  const { debug, toggle } = useDebug()

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand as={Link} href="/">RoboAdvisor</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} className="mx-3 py-2 fs-5" href="/questionnaire">Survey</Nav.Link>
            <Nav.Link as={Link} className="mx-3 py-2 fs-5" href="/frontier">Efficient Frontier</Nav.Link>
            <Nav.Link as={Link} className="mx-3 py-2 fs-5" href="/universe">Fund Universe</Nav.Link>
            <Nav.Link as={Link} className="mx-3 py-2 fs-5" href="/recommendation">Recommendation</Nav.Link>
            <Nav.Link as={Link} className="mx-3 py-2 fs-5" href="/what‑if">What‑If</Nav.Link>
            <Nav.Link as={Link} className="mx-3 py-2 fs-5" href="/about">About</Nav.Link>  {/* ← here */}
          </Nav>
          <Button
            variant={debug ? 'light' : 'outline-light'}
            onClick={toggle}
          >
            Official Use
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}