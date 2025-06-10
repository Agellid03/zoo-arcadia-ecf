import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

const Services = () => {
  const services = [
    {
      id: 1,
      nom: 'Restauration',
      description:
        'Restaurant écologique proposant des produits locaux et biologiques dans un cadre naturel.',
      gratuit: false,
      icone: '🍽️',
    },
    {
      id: 2,
      nom: 'Visite des habitats avec guide',
      description:
        'Visite guidée gratuite de nos trois habitats avec un guide expert passionné de faune.',
      gratuit: true,
      icone: '👨‍🏫',
    },
    {
      id: 3,
      nom: 'Visite du zoo en petit train',
      description:
        'Découverte du zoo à bord de notre petit train écologique pour toute la famille.',
      gratuit: false,
      icone: '🚂',
    },
    {
      id: 4,
      nom: 'Ateliers pédagogiques',
      description:
        "Activités éducatives pour enfants sur la protection de l'environnement et la biodiversité.",
      gratuit: false,
      icone: '📚',
    },
    {
      id: 5,
      nom: 'Soins des animaux',
      description:
        'Observation des soins vétérinaires quotidiens (selon planning et disponibilité).',
      gratuit: true,
      icone: '🩺',
    },
  ];

  return (
    <Container className="mt-5">
      <Row>
        <Col md={8} className="mx-auto text-center">
          <h1 style={{ color: 'var(--zoo-primary)' }}>Nos Services</h1>
          <p className="lead">
            Découvrez tous les services proposés par le Zoo Arcadia pour rendre
            votre visite inoubliable et enrichissante.
          </p>
        </Col>
      </Row>

      <Row className="mt-5">
        {services.map((service) => (
          <Col md={6} lg={4} key={service.id} className="mb-4">
            <Card className="card-zoo h-100">
              <Card.Body className="d-flex flex-column">
                <div className="text-center mb-3">
                  <div style={{ fontSize: '3rem' }}>{service.icone}</div>
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

                <div className="text-center mt-auto">
                  {!service.gratuit && (
                    <small className="text-muted">
                      Service payant - Renseignements à l'accueil
                    </small>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* INFO HORAIRES */}
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Services;
