import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Navbar expand="lg" className="navbar-zoo">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-white fw-bold">
          🦁 Zoo Arcadia
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="text-white">
              Accueil
            </Nav.Link>
            <Nav.Link as={Link} to="/habitats" className="text-white">
              Habitats
            </Nav.Link>
            <Nav.Link as={Link} to="/services" className="text-white">
              Services
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="text-white">
              Contact
            </Nav.Link>
            <Nav.Link as={Link} to="/connexion" className="text-white">
              Connexion
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
