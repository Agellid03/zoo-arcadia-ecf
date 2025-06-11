import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Habitats = () => {
  // États locaux du composant
  const [habitats, setHabitats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL API - CORRECTION pour localhost en développement
  const API_BASE_URL = 'https://zoo-arcadia-ecf.onrender.com/api';

  const fetchHabitats = async () => {
    try {
      // Début chargement
      setLoading(true);
      setError(null);

      console.log('🔄 Chargement habitats depuis API...');

      // Appel API avec Axios
      const response = await axios.get(`${API_BASE_URL}/habitats`);

      console.log('✅ Données reçues:', response.data);

      // Mise à jour état avec données reçues
      setHabitats(response.data);
    } catch (err) {
      // Gestion erreurs
      console.error('❌ Erreur chargement habitats:', err);

      // Message d'erreur user-friendly
      if (err.response) {
        // Erreur HTTP
        setError(`Erreur serveur: ${err.response.status}`);
      } else if (err.request) {
        // Problème réseau
        setError('Problème de connexion au serveur');
      } else {
        // Autre erreur
        setError('Erreur inattendue');
      }
    } finally {
      // Toujours exécuté
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabitats();
  }, []); // [] = dependency array vide = 1 seule exécution

  // Affichage chargement
  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="success" size="lg" />
        <p className="mt-3" style={{ color: 'var(--zoo-primary)' }}>
          Chargement des habitats...
        </p>
      </Container>
    );
  }

  // Affichage erreur
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Erreur de chargement</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchHabitats}>
            🔄 Réessayer
          </Button>
        </Alert>
      </Container>
    );
  }

  // Affichage si succès données
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
            Découvrez nos {habitats.length} écosystèmes reconstitués avec soin.
          </p>
        </Col>
      </Row>

      <Row>
        {habitats.length > 0 ? (
          habitats.map((habitat) => (
            <Col md={6} lg={4} key={habitat.id} className="mb-4">
              <Card className="card-zoo h-100">
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
                    {habitat.description}
                  </Card.Text>

                  {habitat.animaux && habitat.animaux.length > 0 && (
                    <div className="mb-3">
                      <h6 style={{ color: 'var(--zoo-secondary)' }}>
                        Animaux présents ({habitat.animaux.length}) :
                      </h6>
                      <ul className="list-unstyled">
                        {habitat.animaux.slice(0, 3).map((animal) => (
                          <li key={animal.id}>
                            🐾 {animal.prenom} ({animal.race})
                          </li>
                        ))}
                        {habitat.animaux.length > 3 && (
                          <li className="text-muted">
                            ... et {habitat.animaux.length - 3} autres
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* 🔧 CORRECTION BOUTON - Navigation vers détail habitat */}
                  <Button
                    as={Link}
                    to={`/habitat/${habitat.id}`}
                    className="btn-zoo mt-auto"
                  >
                    🔍 Découvrir cet habitat
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          // Fallback si pas de données
          <Col md={12}>
            <Alert variant="info" className="text-center">
              Aucun habitat trouvé.
            </Alert>
          </Col>
        )}
      </Row>

      <Row className="mt-4 mb-5">
        <Col md={12} className="text-center">
          <Button
            variant="outline-success"
            onClick={fetchHabitats}
            disabled={loading}
          >
            🔄 Actualiser les données
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Habitats;
