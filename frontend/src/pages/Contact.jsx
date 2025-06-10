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
import axios from 'axios';

const Contact = () => {
  // ÉTATS FORMULAIRE
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    email: '',
  });

  // ÉTATS UI
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'https://zoo-arcadia-ecf.onrender.com/api';

  // HANDLER CHANGEMENT INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear error when user starts typing
    if (error) setError(null);
  };

  // VALIDATION CÔTÉ CLIENT
  const validateForm = () => {
    if (!formData.titre.trim()) {
      setError('Le titre est obligatoire');
      return false;
    }
    if (!formData.email.trim()) {
      setError("L'email est obligatoire");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Format email invalide');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Le message est obligatoire');
      return false;
    }
    if (formData.description.length < 10) {
      setError('Le message doit contenir au moins 10 caractères');
      return false;
    }
    return true;
  };

  // HANDLER SOUMISSION avec backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation côté client
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      console.log('📤 Envoi message contact:', formData);

      // APPEL API CONTACT
      const response = await axios.post(`${API_BASE_URL}/contact`, {
        titre: formData.titre.trim(),
        description: formData.description.trim(),
        email: formData.email.trim(),
      });

      console.log('✅ Message envoyé:', response.data);

      // SUCCESS STATE
      setSuccess(true);
      setFormData({ titre: '', description: '', email: '' });

      // Auto-hide success après 5s
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('❌ Erreur envoi contact:', err);

      // GESTION ERREURS SPÉCIFIQUES
      if (err.response?.status === 400) {
        setError('Données invalides. Vérifiez vos informations.');
      } else if (err.response?.status === 500) {
        setError('Erreur serveur. Réessayez plus tard.');
      } else if (err.request) {
        setError('Problème de connexion. Vérifiez votre internet.');
      } else {
        setError('Erreur inattendue. Contactez-nous par téléphone.');
      }
    } finally {
      setLoading(false);
    }
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

          {/* ALERT SUCCÈS */}
          {success && (
            <Alert variant="success" className="text-center">
              ✅ Votre message a été envoyé avec succès !
            </Alert>
          )}

          <Card className="card-zoo">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* TITRE */}
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

                {/* EMAIL */}
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

                {/* DESCRIPTION */}
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

                {/* BOUTON ENVOI */}
                <div className="text-center">
                  <Button
                    type="submit"
                    className="btn-zoo btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>⏳ Envoi en cours...</>
                    ) : (
                      '📧 Envoyer le message'
                    )}
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
