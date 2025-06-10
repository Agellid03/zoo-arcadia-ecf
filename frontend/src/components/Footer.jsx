import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: 'var(--zoo-primary)',
        color: 'white',
        marginTop: 'auto',
      }}
      className="py-4"
    >
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5 className="fw-bold mb-3">🦁 Zoo Arcadia</h5>
            <p className="mb-2">
              <small>
                📍 Forêt de Brocéliande
                <br />
                35380 Paimpont, Bretagne
              </small>
            </p>
            <p className="mb-2">
              <small>
                🕒 Ouvert tous les jours
                <br />
                9h00 - 18h00
              </small>
            </p>
            <p className="mb-0">
              <small>🌿 Zoo 100% écologique depuis 1960</small>
            </p>
          </Col>

          <Col md={4} className="mb-3">
            <h6 className="fw-bold mb-3">Navigation</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/"
                  className="text-white text-decoration-none"
                  style={{ fontSize: '0.9rem' }}
                >
                  🏠 Accueil
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/habitats"
                  className="text-white text-decoration-none"
                  style={{ fontSize: '0.9rem' }}
                >
                  🌿 Nos Habitats
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/services"
                  className="text-white text-decoration-none"
                  style={{ fontSize: '0.9rem' }}
                >
                  🎯 Nos Services
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/contact"
                  className="text-white text-decoration-none"
                  style={{ fontSize: '0.9rem' }}
                >
                  📧 Contact
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={4} className="mb-3">
            <h6 className="fw-bold mb-3">Nos Valeurs</h6>
            <div className="d-flex flex-column" style={{ fontSize: '0.9rem' }}>
              <div className="mb-2">
                <span className="me-2">♻️</span>
                <small>Énergie 100% renouvelable</small>
              </div>
              <div className="mb-2">
                <span className="me-2">🌱</span>
                <small>Respect de la biodiversité</small>
              </div>
              <div className="mb-2">
                <span className="me-2">🩺</span>
                <small>Soins vétérinaires quotidiens</small>
              </div>
              <div className="mb-2">
                <span className="me-2">🎓</span>
                <small>Sensibilisation écologique</small>
              </div>
            </div>
          </Col>
        </Row>

        {/* SÉPARATEUR */}
        <hr className="my-4" style={{ borderColor: 'var(--zoo-light)' }} />

        <Row>
          <Col md={8}>
            <p className="mb-0" style={{ fontSize: '0.8rem' }}>
              © {currentYear} Zoo Arcadia - Tous droits réservés |
              <span className="ms-2">
                Développé avec ❤️ pour la protection de la faune
              </span>
            </p>
          </Col>
          <Col md={4} className="text-md-end">
            <p className="mb-0" style={{ fontSize: '0.8rem' }}>
              <Link
                to="/connexion"
                className="text-white text-decoration-none me-3"
              >
                🔐 Espace Pro
              </Link>
              <span className="text-muted">|</span>
              <span className="ms-3">🌍 Projet ECF Développeur Web</span>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
