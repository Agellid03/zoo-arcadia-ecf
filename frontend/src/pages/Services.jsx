import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Alert,
  Button,
} from 'react-bootstrap';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'https://zoo-arcadia-ecf.onrender.com/api';

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Chargement services depuis API...');

      const response = await axios.get(`${API_BASE_URL}/services`);

      console.log('✅ Services reçus:', response.data);
      setServices(response.data);
    } catch (err) {
      console.error('❌ Erreur chargement services:', err);

      if (err.response) {
        setError(`Erreur serveur: ${err.response.status}`);
      } else if (err.request) {
        setError('Problème de connexion au serveur');
      } else {
        setError('Erreur inattendue');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="success" size="lg" />
        <p className="mt-3" style={{ color: 'var(--zoo-primary)' }}>
          Chargement des services...
        </p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Erreur de chargement</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchServices}>
            🔄 Réessayer
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col md={8} className="mx-auto text-center">
          <h1 style={{ color: 'var(--zoo-primary)' }}>Nos Services</h1>
          <p className="lead">
            Découvrez nos {services.length} services pour rendre votre visite
            inoubliable.
          </p>
        </Col>
      </Row>

      <Row className="mt-5">
        {services.length > 0 ? (
          services.map((service) => (
            <Col md={6} lg={4} key={service.id} className="mb-4">
              <Card className="card-zoo h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="text-center mb-3">
                    <div style={{ fontSize: '3rem' }}>
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
                  </div>

                  <Card.Text className="flex-grow-1">
                    {service.description}
                  </Card.Text>

                  {service.prix && (
                    <div className="text-center mb-3">
                      <Badge bg="info">{service.prix}€</Badge>
                    </div>
                  )}

                  <div className="text-center mt-auto">
                    {!service.gratuit && !service.prix && (
                      <small className="text-muted">
                        Renseignements à l'accueil
                      </small>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col md={12}>
            <Alert variant="info" className="text-center">
              Aucun service trouvé.
            </Alert>
          </Col>
        )}
      </Row>

      <Row className="mt-5 mb-5">
        <Col md={8} className="mx-auto">
          <Card className="card-zoo" style={{ backgroundColor: '#f8fffe' }}>
            <Card.Body className="text-center">
              <h5 style={{ color: 'var(--zoo-primary)' }}>
                🕒 Horaires d'ouverture
              </h5>
              <p className="mb-2">
                <strong>Tous les jours :</strong> 9h00 - 18h00
              </p>
              <p className="mb-0 text-muted">
                Dernière entrée 1h avant la fermeture
              </p>

              <Button
                variant="outline-success"
                onClick={fetchServices}
                disabled={loading}
                className="mt-3"
              >
                🔄 Actualiser les services
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Services;
