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
import AvisForm from '../components/AvisForm';

/**
 * PAGE D'ACCUEIL ENRICHIE (US1)
 *
 * FONCTIONNALITÉS :
 * - Présentation zoo avec vraies données API
 * - Preview habitats, services, avis
 * - Statistiques dynamiques
 * - Formulaire avis visiteurs (US5)
 * - Navigation vers pages détaillées
 */
const Accueil = () => {
  // États pour les données API
  const [habitats, setHabitats] = useState([]);
  const [services, setServices] = useState([]);
  const [avis, setAvis] = useState([]);
  const [loadingHabitats, setLoadingHabitats] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingAvis, setLoadingAvis] = useState(true);

  // Configuration API
  const API_BASE_URL = 'https://zoo-arcadia-ecf.onrender.com/api';

  // Chargement habitats
  const fetchHabitats = async () => {
    try {
      console.log('🏡 Chargement habitats...');
      const response = await axios.get(`${API_BASE_URL}/habitats`);
      console.log('✅ Habitats reçus:', response.data);
      setHabitats(response.data);
    } catch (error) {
      console.error('❌ Erreur habitats:', error);
    } finally {
      setLoadingHabitats(false);
    }
  };

  // Chargement services
  const fetchServices = async () => {
    try {
      console.log('🎯 Chargement services...');
      const response = await axios.get(`${API_BASE_URL}/services`);
      console.log('✅ Services reçus:', response.data);
      setServices(response.data);
    } catch (error) {
      console.error('❌ Erreur services:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  // Chargement avis approuvés
  const fetchAvis = async () => {
    try {
      console.log('💬 Chargement avis...');
      const response = await axios.get(`${API_BASE_URL}/avis`);
      console.log('✅ Avis reçus:', response.data);
      setAvis(response.data);
    } catch (error) {
      console.error('❌ Erreur avis:', error);
    } finally {
      setLoadingAvis(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchHabitats();
    fetchServices();
    fetchAvis();
  }, []);

  // Callback pour rafraîchir avis après soumission
  const handleAvisSubmitted = () => {
    // Optionnel : rafraîchir les avis ou afficher message
    console.log('🎉 Nouvel avis soumis !');
  };

  return (
    <Container className="mt-4">
      {/* HERO SECTION */}
      <Row className="mb-5">
        <Col md={12} className="text-center">
          <h1
            className="display-3 mb-4"
            style={{ color: 'var(--zoo-primary)' }}
          >
            🦁 Bienvenue au Zoo Arcadia
          </h1>
          <p className="lead mb-4" style={{ fontSize: '1.3rem' }}>
            Découvrez un monde sauvage au cœur de la Bretagne, près de la forêt
            de Brocéliande. Depuis 1960, nous nous engageons pour la protection
            et le bien-être animal.
          </p>
          <div className="d-flex justify-content-center gap-3 mb-4">
            <Button as={Link} to="/habitats" className="btn-zoo btn-lg">
              🏡 Découvrir nos Habitats
            </Button>
            <Button
              as={Link}
              to="/services"
              variant="outline-primary"
              size="lg"
            >
              🎯 Nos Services
            </Button>
          </div>
        </Col>
      </Row>

      {/* STATISTIQUES RAPIDES */}
      <Row className="mb-5">
        <Col md={4} className="text-center mb-3">
          <h3 style={{ color: 'var(--zoo-primary)' }}>
            {loadingHabitats ? <Spinner size="sm" /> : habitats.length}
          </h3>
          <p className="mb-0">Écosystèmes reconstitués</p>
        </Col>
        <Col md={4} className="text-center mb-3">
          <h3 style={{ color: 'var(--zoo-primary)' }}>
            {loadingServices ? <Spinner size="sm" /> : services.length}
          </h3>
          <p className="mb-0">Services disponibles</p>
        </Col>
        <Col md={4} className="text-center mb-3">
          <h3 style={{ color: 'var(--zoo-primary)' }}>
            {loadingHabitats ? (
              <Spinner size="sm" />
            ) : (
              habitats.reduce(
                (total, habitat) => total + (habitat.animaux?.length || 0),
                0,
              )
            )}
          </h3>
          <p className="mb-0">Animaux protégés</p>
        </Col>
      </Row>

      {/* SECTION HABITATS */}
      <Row className="mb-5">
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: 'var(--zoo-primary)' }}>🏡 Nos Habitats</h2>
            <Button as={Link} to="/habitats" variant="outline-primary">
              Voir tous les habitats →
            </Button>
          </div>
        </Col>

        {loadingHabitats ? (
          <Col md={12} className="text-center">
            <Spinner
              animation="border"
              style={{ color: 'var(--zoo-primary)' }}
            />
            <p className="mt-2">Chargement des habitats...</p>
          </Col>
        ) : (
          habitats.slice(0, 3).map((habitat) => (
            <Col md={4} key={habitat.id} className="mb-4">
              <Card className="card-zoo h-100 shadow-sm">
                {habitat.image && (
                  <Card.Img
                    variant="top"
                    src={habitat.image}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/images/default-habitat.jpg';
                    }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: 'var(--zoo-primary)' }}>
                    {habitat.nom}
                  </Card.Title>
                  <Card.Text className="flex-grow-1">
                    {habitat.description.length > 100
                      ? `${habitat.description.substring(0, 100)}...`
                      : habitat.description}
                  </Card.Text>
                  {habitat.animaux && habitat.animaux.length > 0 && (
                    <div className="mb-3">
                      <Badge bg="info" className="me-2">
                        {habitat.animaux.length} animaux
                      </Badge>
                      <small className="text-muted">
                        {habitat.animaux
                          .slice(0, 2)
                          .map((a) => a.prenom)
                          .join(', ')}
                        {habitat.animaux.length > 2 && '...'}
                      </small>
                    </div>
                  )}
                  <Button
                    as={Link}
                    to={`/habitat/${habitat.id}`}
                    className="btn-zoo mt-auto"
                  >
                    🔍 Explorer cet habitat
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* SECTION SERVICES */}
      <Row className="mb-5">
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: 'var(--zoo-primary)' }}>🎯 Nos Services</h2>
            <Button as={Link} to="/services" variant="outline-primary">
              Découvrir tous nos services →
            </Button>
          </div>
        </Col>

        {loadingServices ? (
          <Col md={12} className="text-center">
            <Spinner
              animation="border"
              style={{ color: 'var(--zoo-primary)' }}
            />
            <p className="mt-2">Chargement des services...</p>
          </Col>
        ) : (
          services.slice(0, 3).map((service) => (
            <Col md={4} key={service.id} className="mb-4">
              <Card className="card-zoo h-100 shadow-sm border-0">
                <Card.Body className="text-center">
                  <Card.Title style={{ color: 'var(--zoo-secondary)' }}>
                    {service.nom}
                  </Card.Title>
                  <Card.Text>
                    {service.description.length > 120
                      ? `${service.description.substring(0, 120)}...`
                      : service.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* SECTION AVIS VISITEURS */}
      <Row className="mb-5">
        <Col md={12}>
          <h2 className="mb-4" style={{ color: 'var(--zoo-primary)' }}>
            💬 Avis de nos Visiteurs
          </h2>
        </Col>

        {/* AVIS APPROUVÉS */}
        <Col lg={8}>
          <Row>
            {loadingAvis ? (
              <Col md={12} className="text-center">
                <Spinner
                  animation="border"
                  style={{ color: 'var(--zoo-primary)' }}
                />
                <p className="mt-2">Chargement des avis...</p>
              </Col>
            ) : avis.length > 0 ? (
              avis.slice(0, 4).map((avisItem) => (
                <Col md={6} key={avisItem.id} className="mb-3">
                  <Card className="border-0 bg-light h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">{avisItem.pseudo}</h6>
                        <Badge bg="success">✅ Vérifié</Badge>
                      </div>
                      <Card.Text className="small">
                        "
                        {avisItem.texte.length > 100
                          ? `${avisItem.texte.substring(0, 100)}...`
                          : avisItem.texte}
                        "
                      </Card.Text>
                      <small className="text-muted">
                        {new Date(avisItem.createdAt).toLocaleDateString(
                          'fr-FR',
                        )}
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col md={12}>
                <Card className="border-0 bg-light text-center">
                  <Card.Body>
                    <p className="mb-0 text-muted">
                      Soyez le premier à laisser un avis ! 👉
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </Col>

        {/* FORMULAIRE AVIS (US5) */}
        <Col lg={4}>
          <AvisForm onAvisSubmitted={handleAvisSubmitted} />
        </Col>
      </Row>

      {/* SECTION VALEURS ÉCOLOGIQUES */}
      <Row className="mb-5">
        <Col md={12}>
          <Card className="border-0 bg-success text-white">
            <Card.Body className="text-center py-5">
              <h3 className="mb-4">🌱 Nos Valeurs Écologiques</h3>
              <Row>
                <Col md={4} className="mb-3">
                  <h5>🔋 100% Autonome</h5>
                  <p className="mb-0">Énergies renouvelables exclusivement</p>
                </Col>
                <Col md={4} className="mb-3">
                  <h5>🦎 Conservation</h5>
                  <p className="mb-0">Protection des espèces menacées</p>
                </Col>
                <Col md={4} className="mb-3">
                  <h5>🌍 Éducation</h5>
                  <p className="mb-0">Sensibilisation environnementale</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CALL TO ACTION */}
      <Row className="mb-5">
        <Col md={12} className="text-center">
          <h3 className="mb-4" style={{ color: 'var(--zoo-primary)' }}>
            Prêt pour l'aventure ?
          </h3>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button as={Link} to="/habitats" className="btn-zoo btn-lg">
              🦁 Explorer la Savane
            </Button>
            <Button as={Link} to="/habitats" className="btn-zoo btn-lg">
              🐸 Découvrir les Marais
            </Button>
            <Button as={Link} to="/habitats" className="btn-zoo btn-lg">
              🦜 Visiter la Jungle
            </Button>
          </div>
          <div className="mt-4">
            <Button as={Link} to="/contact" variant="outline-primary" size="lg">
              📞 Nous Contacter
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Accueil;
