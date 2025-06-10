import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from 'react-bootstrap';

const Contact = () => {
  // ÉTAT FORMULAIRE
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    email: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // HANDLER CHANGEMENT INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLER SOUMISSION
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Données formulaire:', formData);
    setShowSuccess(true);

    setFormData({ titre: '', description: '', email: '' });

    // Masquer message après 3s
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={8} className="mx-auto">
          <h1
            className="text-center mb-4"
            style={{ color: 'var(--zoo-primary)' }}
          >
            Nous Contacter
          </h1>
          <p className="text-center lead mb-5">
            Une question ? Un commentaire ? N'hésitez pas à nous écrire !
          </p>

          {showSuccess && (
            <Alert variant="success" className="text-center">
              ✅ Votre message a été envoyé avec succès !
            </Alert>
          )}

          <Card className="card-zoo">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Titre *</Form.Label>
                  <Form.Control
                    type="text"
                    name="titre"
                    value={formData.titre}
                    onChange={handleChange}
                    placeholder="Objet de votre message"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre.email@exemple.com"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez votre demande..."
                    required
                  />
                </Form.Group>

                <div className="text-center">
                  <Button type="submit" className="btn-zoo btn-lg">
                    📧 Envoyer le message
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* INFOS CONTACT */}
          <Row className="mt-5">
            <Col md={6}>
              <Card className="card-zoo h-100">
                <Card.Body className="text-center">
                  <h5 style={{ color: 'var(--zoo-primary)' }}>📍 Adresse</h5>
                  <p>
                    Zoo Arcadia
                    <br />
                    Forêt de Brocéliande
                    <br />
                    35380 Paimpont, Bretagne
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="card-zoo h-100">
                <Card.Body className="text-center">
                  <h5 style={{ color: 'var(--zoo-primary)' }}>🕒 Horaires</h5>
                  <p>
                    Ouvert tous les jours
                    <br />
                    9h00 - 18h00
                    <br />
                    <small className="text-muted">
                      Dernière entrée à 17h00
                    </small>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
