import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

/**
 * FORMULAIRE AVIS VISITEURS (US5)
 *
 * FONCTIONNALITÉS :
 * - Soumission avis par visiteurs
 * - Validation côté client
 * - Statut en_attente automatique
 * - Feedback utilisateur
 */
const AvisForm = () => {
  // États formulaire
  const [formData, setFormData] = useState({
    pseudo: '',
    texte: '',
  });

  // États UI
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Configuration API
  const API_BASE_URL = 'https://zoo-arcadia-ecf.onrender.com/api';

  // Gestion changements formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Soumission avis
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('📝 Soumission avis visiteur:', formData.pseudo);

      await axios.post(`${API_BASE_URL}/avis`, formData);

      // Succès
      setSuccess(true);
      setFormData({ pseudo: '', texte: '' });
      console.log('✅ Avis soumis avec succès');
    } catch (error) {
      console.error('❌ Erreur soumission avis:', error);
      setError("Erreur lors de l'envoi de votre avis. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">💬 Laissez votre avis</h5>
      </Card.Header>
      <Card.Body>
        {/* MESSAGE SUCCÈS */}
        {success && (
          <Alert variant="success" className="mb-4">
            <strong>✅ Merci !</strong> Votre avis a été soumis avec succès. Il
            sera examiné par notre équipe avant publication.
          </Alert>
        )}

        {/* MESSAGE ERREUR */}
        {error && (
          <Alert variant="danger" className="mb-4">
            <strong>❌ Erreur :</strong> {error}
          </Alert>
        )}

        {/* FORMULAIRE */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <strong>👤 Votre pseudo :</strong>
            </Form.Label>
            <Form.Control
              type="text"
              name="pseudo"
              value={formData.pseudo}
              onChange={handleChange}
              placeholder="Comment souhaitez-vous apparaître ?"
              required
              disabled={loading}
              maxLength={50}
            />
            <Form.Text className="text-muted">Maximum 50 caractères</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>📝 Votre avis :</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="texte"
              value={formData.texte}
              onChange={handleChange}
              placeholder="Partagez votre expérience au Zoo Arcadia..."
              required
              disabled={loading}
              maxLength={500}
            />
            <Form.Text className="text-muted">
              {formData.texte.length}/500 caractères
            </Form.Text>
          </Form.Group>

          <div className="d-grid">
            <Button
              type="submit"
              className="btn-zoo"
              disabled={
                loading || !formData.pseudo.trim() || !formData.texte.trim()
              }
              size="lg"
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-2"
                  />
                  Envoi en cours...
                </>
              ) : (
                '📨 Envoyer mon avis'
              )}
            </Button>
          </div>
        </Form>

        {/* INFORMATIONS */}
        <div className="mt-4 p-3 bg-light rounded">
          <small className="text-muted">
            <strong>💡 Information :</strong> Tous les avis sont modérés par
            notre équipe avant publication pour garantir un contenu approprié et
            constructif.
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AvisForm;
