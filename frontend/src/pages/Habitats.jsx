import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Habitats = () => {
  return (
    <Container className="mt-5">
      <Row>
        <Col md={12}>
          <h1
            className="text-center mb-4"
            style={{ color: 'var(--zoo-primary)' }}
          >
            Nos Habitats
          </h1>
          <p className="text-center lead mb-5">
            Découvrez nos trois écosystèmes reconstitués avec soin pour le
            bien-être de nos animaux.
          </p>
        </Col>
      </Row>

      {/* Habitat Savane */}
      <Row className="mb-5">
        <Col md={6}>
          <Card className="card-zoo h-100">
            <Card.Body>
              <Card.Title style={{ color: 'var(--zoo-primary)' }}>
                🌿 Savane Africaine
              </Card.Title>
              <Card.Text>
                Un vaste espace de 5 hectares reproduisant les conditions de la
                savane africaine, avec ses grandes étendues herbeuses et ses
                points d'eau naturels.
              </Card.Text>
              <h6 style={{ color: 'var(--zoo-secondary)' }}>
                Animaux présents :
              </h6>
              <ul>
                <li>Lions d'Afrique</li>
                <li>Éléphants</li>
                <li>Girafes</li>
                <li>Zèbres</li>
              </ul>
              <Button className="btn-zoo">Voir les animaux</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="card-zoo h-100">
            <Card.Body>
              <Card.Title style={{ color: 'var(--zoo-primary)' }}>
                🌳 Jungle Tropicale
              </Card.Title>
              <Card.Text>
                Une forêt tropicale humide avec une végétation luxuriante,
                cascades et passerelles surélevées pour une immersion totale.
              </Card.Text>
              <h6 style={{ color: 'var(--zoo-secondary)' }}>
                Animaux présents :
              </h6>
              <ul>
                <li>Jaguars</li>
                <li>Singes hurleurs</li>
                <li>Toucans</li>
                <li>Paresseux</li>
              </ul>
              <Button className="btn-zoo">Voir les animaux</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={6} className="mx-auto">
          <Card className="card-zoo h-100">
            <Card.Body>
              <Card.Title style={{ color: 'var(--zoo-primary)' }}>
                🐸 Marais et Zones Humides
              </Card.Title>
              <Card.Text>
                Un écosystème aquatique avec bassins naturels, végétation
                marécageuse et observatoires discrets.
              </Card.Text>
              <h6 style={{ color: 'var(--zoo-secondary)' }}>
                Animaux présents :
              </h6>
              <ul>
                <li>Crocodiles</li>
                <li>Flamants roses</li>
                <li>Tortues géantes</li>
                <li>Loutres</li>
              </ul>
              <Button className="btn-zoo">Voir les animaux</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Info vétérinaire */}
      <Row className="mt-5 mb-5">
        <Col md={8} className="mx-auto">
          <Card className="card-zoo" style={{ backgroundColor: '#f8fffe' }}>
            <Card.Body className="text-center">
              <h5 style={{ color: 'var(--zoo-primary)' }}>
                🩺 Suivi Vétérinaire
              </h5>
              <p className="mb-0">
                Nos vétérinaires effectuent des contrôles quotidiens pour
                s'assurer de la santé et du bien-être de tous nos animaux.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Habitats;
