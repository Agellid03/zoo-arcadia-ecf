import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Accueil = () => {
  return (
    <Container className="mt-5">
      <Row>
        <Col md={8} className="mx-auto text-center">
          <h1 style={{ color: 'var(--zoo-primary)' }}>
            Bienvenue au Zoo Arcadia
          </h1>
          <p className="lead">
            Découvrez la faune exceptionnelle de notre zoo écologique situé près
            de la forêt de Brocéliande en Bretagne depuis 1960.
          </p>
          <p className="text-muted">
            Notre zoo est entièrement indépendant au niveau énergétique et
            respecte les valeurs écologiques qui nous tiennent à cœur.
          </p>
          <Button className="btn-zoo btn-lg me-3">
            Découvrir nos habitats
          </Button>
          <Button variant="outline-success" size="lg">
            Nos services
          </Button>
        </Col>
      </Row>

      {/* Section Habitats */}
      <Row className="mt-5">
        <Col md={12}>
          <h2
            className="text-center mb-4"
            style={{ color: 'var(--zoo-primary)' }}
          >
            Nos Habitats
          </h2>
        </Col>
        <Col md={4}>
          <Card className="card-zoo mb-4">
            <Card.Body>
              <Card.Title style={{ color: 'var(--zoo-primary)' }}>
                🌿 Savane
              </Card.Title>
              <Card.Text>
                Découvrez les animaux de la savane africaine dans un
                environnement naturel préservé avec nos lions, éléphants et
                girafes.
              </Card.Text>
              <Button className="btn-zoo">Explorer la Savane</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-zoo mb-4">
            <Card.Body>
              <Card.Title style={{ color: 'var(--zoo-primary)' }}>
                🌳 Jungle
              </Card.Title>
              <Card.Text>
                Plongez dans l'univers tropical de notre habitat jungle avec ses
                singes, oiseaux exotiques et félins.
              </Card.Text>
              <Button className="btn-zoo">Explorer la Jungle</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-zoo mb-4">
            <Card.Body>
              <Card.Title style={{ color: 'var(--zoo-primary)' }}>
                🐸 Marais
              </Card.Title>
              <Card.Text>
                Observez la faune aquatique dans notre écosystème marécageux
                avec crocodiles, flamants et tortues.
              </Card.Text>
              <Button className="btn-zoo">Explorer les Marais</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Section Avis */}
      <Row className="mt-5 mb-5">
        <Col md={12}>
          <h2
            className="text-center mb-4"
            style={{ color: 'var(--zoo-primary)' }}
          >
            Avis de nos visiteurs
          </h2>
        </Col>
        <Col md={6}>
          <Card className="card-zoo">
            <Card.Body>
              <Card.Text>
                "Une expérience incroyable ! Les animaux semblent heureux et
                l'engagement écologique du zoo est remarquable."
              </Card.Text>
              <Card.Footer className="text-muted">
                - Marie, visiteur
              </Card.Footer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="card-zoo">
            <Card.Body>
              <Card.Text>
                "Mes enfants ont adoré la visite guidée. Le personnel est
                passionné et très pédagogue."
              </Card.Text>
              <Card.Footer className="text-muted">- Jean, famille</Card.Footer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Accueil;
