import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  // États du formulaire
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // États UI
  const [loading, setLoading] = useState(false);
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

  // Soumission formulaire LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log(' Tentative connexion pour:', formData.email);

      // 1. APPEL API LOGIN
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email: formData.email,
        password: formData.password,
      });

      console.log('✅ Réponse login:', response.data);

      // 2. EXTRACTION DONNÉES
      const { token, user } = response.data;

      // 3. STOCKAGE TOKEN (localStorage pour simplicité)
      localStorage.setItem('zoo_token', token);
      localStorage.setItem('zoo_user', JSON.stringify(user));

      console.log(' Token stocké, utilisateur:', user);

      // 4. REDIRECTION SELON RÔLE
      switch (user.role) {
        case 'admin':
          console.log(' Redirection dashboard admin');
          navigate('/dashboard/admin');
          break;
        case 'employe':
          console.log(' Redirection dashboard employé');
          navigate('/dashboard/employe');
          break;
        case 'veterinaire':
          console.log(' Redirection dashboard vétérinaire');
          navigate('/dashboard/veterinaire');
          break;
        default:
          console.log(' Rôle inconnu, redirection accueil');
          navigate('/');
      }
    } catch (error) {
      console.error('❌ Erreur login:', error);

      // Gestion erreurs spécifiques
      if (error.response?.status === 401) {
        setError('Email ou mot de passe incorrect');
      } else if (error.response?.status === 500) {
        setError('Erreur serveur, réessayez plus tard');
      } else {
        setError('Erreur de connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white text-center py-4">
              <h2 style={{ color: 'var(--zoo-primary)' }}>
                🔐 Connexion Staff
              </h2>
              <p className="text-muted mb-0">
                Accès réservé aux employés du zoo
              </p>
            </Card.Header>

            <Card.Body className="p-4">
              {/* AFFICHAGE ERREUR */}
              {error && (
                <Alert variant="danger" className="mb-4">
                  <strong>Erreur :</strong> {error}
                </Alert>
              )}

              {/* FORMULAIRE LOGIN */}
              <Form onSubmit={handleSubmit}>
                {/* CHAMP EMAIL */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>📧 Email :</strong>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre.email@zoo-arcadia.fr"
                    required
                    disabled={loading}
                    className="form-control-lg"
                  />
                </Form.Group>

                {/* CHAMP PASSWORD */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    <strong>🔒 Mot de passe :</strong>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Votre mot de passe"
                    required
                    disabled={loading}
                    className="form-control-lg"
                  />
                </Form.Group>

                {/* BOUTON SUBMIT */}
                <Button
                  type="submit"
                  className="btn-zoo w-100 py-3"
                  disabled={loading || !formData.email || !formData.password}
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
                      Connexion...
                    </>
                  ) : (
                    '🚀 Se connecter'
                  )}
                </Button>
              </Form>
            </Card.Body>

            {/* INFORMATIONS DÉVELOPPEMENT */}
            <Card.Footer className="bg-light text-center">
              <small className="text-muted">
                <strong>💡 Comptes de test :</strong>
                <br />
                Admin : admin@zoo.fr
                <br />
                Employé : employe@zoo.fr
                <br />
                Vétérinaire : vet@zoo.fr
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
