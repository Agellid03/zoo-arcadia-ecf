import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Accueil = () => {
  // ÉTATS MULTIPLES pour différentes sections
  const [habitats, setHabitats] = useState([]);
  const [services, setServices] = useState([]);
  const [avis, setAvis] = useState([]);

  // Loading states séparés
  const [loadingHabitats, setLoadingHabitats] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingAvis, setLoadingAvis] = useState(true);

  const API_BASE_URL = 'https://zoo-arcadia-ecf.onrender.com/api';

  const fetchHabitats = async () => {
    try {
      setLoadingHabitats(true);
      const response = await axios.get(`${API_BASE_URL}/habitats`);
      // Limiter à 3 premiers habitats pour preview
      setHabitats(response.data.slice(0, 3));
    } catch (err) {
      console.error('Erreur chargement habitats preview:', err);
    } finally {
      setLoadingHabitats(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const response = await axios.get(`${API_BASE_URL}/services`);
      setServices(response.data);
    } catch (err) {
      console.error('Erreur chargement services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchAvis = async () => {
    try {
      setLoadingAvis(true);
      // Simulation avis en attendant endpoint backend
      const avisSimules = [
        {
          id: 1,
          pseudo: 'Marie',
          avis: "Une expérience incroyable ! Les animaux semblent heureux et l'engagement écologique du zoo est remarquable.",
          valide: true,
        },
        {
          id: 2,
          pseudo: 'Jean',
          avis: 'Mes enfants ont adoré la visite guidée. Le personnel est passionné et très pédagogue.',
          valide: true,
        },
      ];

      // Plus tard : const response = await axios.get(`${API_BASE_URL}/avis?valide=true&limit=3`);
      setAvis(avisSimules);
    } catch (err) {
      console.error('Erreur chargement avis:', err);
    } finally {
      setLoadingAvis(false);
    }
  };

  /** useEffect multiples - Chargement parallèle
    Chaque section se charge indépendamment */

  useEffect(() => {
    fetchHabitats();
  }, []);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    fetchAvis();
  }, []);

  return (
    <Container className="mt-5">
      {/* HERO SECTION */}
      <Row className="mb-5">
        <Col md={8} className="mx-auto text-center">
          <h1
            style={{ color: 'var(--zoo-primary)', fontSize: '3rem' }}
            className="mb-4"
          >
            Bienvenue au Zoo Arcadia
          </h1>
          <p className="lead mb-4">
            Découvrez la faune exceptionnelle de notre zoo écologique situé près
            de la forêt de Brocéliande en Bretagne depuis 1960.
          </p>
          <p className="text-muted mb-4">
            Notre zoo est entièrement indépendant au niveau énergétique et
            respecte les valeurs écologiques qui nous tiennent à cœur.
          </p>

          {/* CALL TO ACTION */}
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Button as={Link} to="/habitats" className="btn-zoo btn-lg">
              🌿 Découvrir nos habitats
            </Button>
            <Button
              as={Link}
              to="/services"
              variant="outline-success"
              size="lg"
            >
              🎯 Nos services
            </Button>
          </div>
        </Col>
      </Row>

      {/* STATISTIQUES RAPIDES */}
      <Row className="mb-5">
        <Col md={12}>
          <Card className="card-zoo" style={{ backgroundColor: '#f8fffe' }}>
            <Card.Body>
              <Row className="text-center">
                <Col md={3}>
                  <h3 style={{ color: 'var(--zoo-primary)' }}>
                    {loadingHabitats ? <Spinner size="sm" /> : habitats.length}+
                  </h3>
                  <p className="mb-0">Habitats naturels</p>
                </Col>
                <Col md={3}>
                  <h3 style={{ color: 'var(--zoo-primary)' }}>
                    {loadingServices ? <Spinner size="sm" /> : services.length}
                  </h3>
                  <p className="mb-0">Services disponibles</p>
                </Col>
                <Col md={3}>
                  <h3 style={{ color: 'var(--zoo-primary)' }}>65</h3>
                  <p className="mb-0">Années d'expérience</p>
                </Col>
                <Col md={3}>
                  <h3 style={{ color: 'var(--zoo-primary)' }}>100%</h3>
                  <p className="mb-0">Énergie renouvelable</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* PREVIEW HABITATS */}
      <Row className="mb-5">
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: 'var(--zoo-primary)' }}>Nos Habitats</h2>
            <Button as={Link} to="/habitats" variant="outline-success">
              Voir tous les habitats →
            </Button>
          </div>
        </Col>

        {loadingHabitats ? (
          <Col md={12} className="text-center">
            <Spinner animation="border" variant="success" />
            <p className="mt-2">Chargement des habitats...</p>
          </Col>
        ) : (
          habitats.map((habitat) => (
            <Col md={4} key={habitat.id} className="mb-4">
              <Card className="card-zoo h-100">
                <Card.Body>
                  <Card.Title style={{ color: 'var(--zoo-primary)' }}>
                    {habitat.nom}
                  </Card.Title>
                  <Card.Text>
                    {habitat.description?.substring(0, 100)}...
                  </Card.Text>
                  <Button as={Link} to="/habitats" className="btn-zoo">
                    Découvrir
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* SECTION SERVICES - AJOUT ICI */}
      <Row className="mb-5">
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: 'var(--zoo-primary)' }}>Nos Services</h2>
            <Button as={Link} to="/services" variant="outline-success">
              Découvrir tous nos services →
            </Button>
          </div>
        </Col>

        {loadingServices ? (
          <Col md={12} className="text-center">
            <Spinner animation="border" variant="success" />
            <p className="mt-2">Chargement des services...</p>
          </Col>
        ) : (
          services.slice(0, 3).map((service) => (
            <Col md={4} key={service.id} className="mb-4">
              <Card className="card-zoo h-100">
                <Card.Body className="text-center">
                  <div style={{ fontSize: '2.5rem' }} className="mb-3">
                    {service.icone || '🎯'}
                  </div>
                  <Card.Title style={{ color: 'var(--zoo-primary)' }}>
                    {service.nom}
                    {service.gratuit && (
                      <Badge bg="success" className="ms-2">
                        Gratuit
                      </Badge>
                    )}
                  </Card.Title>
                  <Card.Text>
                    {service.description?.substring(0, 80)}...
                  </Card.Text>
                  <Button as={Link} to="/services" className="btn-zoo">
                    En savoir plus
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* AVIS VISITEURS */}
      <Row className="mb-5">
        <Col md={12}>
          <h2
            className="text-center mb-4"
            style={{ color: 'var(--zoo-primary)' }}
          >
            Ce que disent nos visiteurs
          </h2>
        </Col>

        {loadingAvis ? (
          <Col md={12} className="text-center">
            <Spinner animation="border" variant="success" />
          </Col>
        ) : (
          avis.map((avisItem) => (
            <Col md={6} key={avisItem.id} className="mb-4">
              <Card className="card-zoo h-100">
                <Card.Body>
                  <Card.Text className="mb-3">"{avisItem.avis}"</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">- {avisItem.pseudo}</small>
                    <Badge bg="success">Avis vérifié</Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}

        <Col md={12} className="text-center mt-3">
          <Button as={Link} to="/contact" variant="outline-success">
            💬 Laisser un avis
          </Button>
        </Col>
      </Row>

      {/* CALL TO ACTION FINAL */}
      <Row className="mb-5">
        <Col md={8} className="mx-auto">
          <Card
            className="card-zoo text-center"
            style={{ backgroundColor: 'var(--zoo-nature)', border: 'none' }}
          >
            <Card.Body className="py-5">
              <h3 style={{ color: 'var(--zoo-primary)' }} className="mb-4">
                Prêt pour l'aventure ?
              </h3>
              <p className="lead mb-4">
                Rejoignez-nous pour une expérience unique au cœur de la nature
                bretonne.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Button as={Link} to="/habitats" className="btn-zoo btn-lg">
                  🦁 Explorer maintenant
                </Button>
                <Button
                  as={Link}
                  to="/contact"
                  variant="outline-dark"
                  size="lg"
                >
                  📞 Nous contacter
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Accueil;
