import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
} from 'react-bootstrap';
import axios from 'axios';

const HabitatDetail = () => {
  // RÉCUPÉRATION PARAMÈTRE URL
  const { id } = useParams(); // id depuis /habitat/:id
  const navigate = useNavigate(); // Navigation programmatique

  // ÉTATS LOCAUX
  const [habitat, setHabitat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'https://zoo-arcadia-ecf.onrender.com/api';

  /** FETCH HABITAT SPÉCIFIQUE avec animaux
    API: GET /habitats/:id (avec include animaux)*/

  const fetchHabitat = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔍 Chargement habitat ID: ${id}`);

      // APPEL API avec ID spécifique
      const response = await axios.get(`${API_BASE_URL}/habitats/${id}`);

      console.log('✅ Habitat chargé:', response.data);
      setHabitat(response.data);
    } catch (err) {
      console.error('❌ Erreur chargement habitat:', err);

      if (err.response?.status === 404) {
        setError('Habitat non trouvé');
      } else if (err.response?.status === 400) {
        setError('ID habitat invalide');
      } else {
        setError('Erreur chargement habitat');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
    useEffect - Chargement au mount + changement ID
    Dependency [id] = recharge si ID change dans URL
   */
  useEffect(() => {
    if (id) {
      fetchHabitat();
    }
  }, [id]);

  // LOADING STATE
  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="success" size="lg" />
        <p className="mt-3" style={{ color: 'var(--zoo-primary)' }}>
          Chargement habitat...
        </p>
      </Container>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="outline-danger" onClick={fetchHabitat}>
              🔄 Réessayer
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/habitats')}
            >
              ← Retour aux habitats
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // HABITAT NON TROUVÉ
  if (!habitat) {
    return (
      <Container className="mt-5">
        <Alert variant="warning" className="text-center">
          <Alert.Heading>Habitat non trouvé</Alert.Heading>
          <p>L'habitat demandé n'existe pas ou plus.</p>
          <Button
            variant="outline-warning"
            onClick={() => navigate('/habitats')}
          >
            ← Retour aux habitats
          </Button>
        </Alert>
      </Container>
    );
  }

  // AFFICHAGE SUCCÈS
  return (
    <Container className="mt-5">
      {/* BREADCRUMB NAVIGATION */}
      <Row className="mb-4">
        <Col md={12}>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none">
                  Accueil
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/habitats" className="text-decoration-none">
                  Habitats
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {habitat.nom}
              </li>
            </ol>
          </nav>
        </Col>
      </Row>

      {/* HEADER HABITAT */}
      <Row className="mb-5">
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h1 style={{ color: 'var(--zoo-primary)' }} className="mb-3">
                {habitat.nom}
              </h1>
              <p className="lead mb-0">{habitat.description}</p>
            </div>
            <Button
              variant="outline-success"
              onClick={() => navigate('/habitats')}
            >
              ← Retour
            </Button>
          </div>
        </Col>
      </Row>

      {/* IMAGE HABITAT (si disponible) */}
      {habitat.image && (
        <Row className="mb-5">
          <Col md={12}>
            <Card className="border-0">
              <Card.Img
                variant="top"
                src={habitat.image}
                style={{
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '15px',
                }}
                alt={habitat.nom}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* ANIMAUX DE L'HABITAT */}
      <Row className="mb-5">
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: 'var(--zoo-primary)' }}>
              Animaux de cet habitat
            </h2>
            <Badge bg="info" style={{ fontSize: '1rem' }}>
              {habitat.animaux?.length || 0} animal(x)
            </Badge>
          </div>
        </Col>

        {/* LISTE ANIMAUX */}
        {habitat.animaux && habitat.animaux.length > 0 ? (
          habitat.animaux.map((animal) => (
            <Col md={6} lg={4} key={animal.id} className="mb-4">
              <Card className="card-zoo h-100 shadow-sm">
                {/* IMAGE ANIMAL (si disponible) */}
                {animal.image && (
                  <Card.Img
                    variant="top"
                    src={animal.image}
                    style={{ height: '200px', objectFit: 'cover' }}
                    alt={animal.prenom}
                  />
                )}

                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: 'var(--zoo-primary)' }}>
                    🐾 {animal.prenom}
                  </Card.Title>

                  <Card.Text className="mb-2">
                    <strong>Race :</strong> {animal.race}
                  </Card.Text>

                  {/* ÉTAT ANIMAL (si disponible) */}
                  {animal.etat && (
                    <div className="mb-3">
                      <Badge
                        bg={
                          animal.etat === 'Bonne santé' ? 'success' : 'warning'
                        }
                        className="mb-2"
                      >
                        État : {animal.etat}
                      </Badge>
                    </div>
                  )}

                  {/* BOUTON DÉTAIL - Navigation vers animal */}
                  <Button
                    as={Link}
                    to={`/animal/${animal.id}`}
                    className="btn-zoo mt-auto"
                  >
                    👁️ Voir détail
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col md={12}>
            <Alert variant="info" className="text-center">
              <p className="mb-0">
                Aucun animal dans cet habitat pour le moment.
              </p>
            </Alert>
          </Col>
        )}
      </Row>

      {/* COMMENTAIRES VÉTÉRINAIRE (si disponibles) */}
      {habitat.commentaires && habitat.commentaires.length > 0 && (
        <Row className="mb-5">
          <Col md={12}>
            <h3 style={{ color: 'var(--zoo-primary)' }} className="mb-4">
              🩺 Avis vétérinaire sur l'habitat
            </h3>
            {habitat.commentaires.slice(0, 3).map((commentaire) => (
              <Card key={commentaire.id} className="card-zoo mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="mb-0">
                      Dr. {commentaire.veterinaire?.nom || 'Vétérinaire'}
                    </h6>
                    <small className="text-muted">
                      {new Date(commentaire.date_visite).toLocaleDateString()}
                    </small>
                  </div>
                  <p className="mb-2">{commentaire.commentaire}</p>
                  <Badge bg="secondary">{commentaire.statut_habitat}</Badge>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      )}

      {/* ACTIONS */}
      <Row className="mb-5">
        <Col md={12} className="text-center">
          <div className="d-flex gap-3 justify-content-center">
            <Button
              variant="outline-success"
              onClick={() => navigate('/habitats')}
            >
              ← Voir tous les habitats
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => navigate('/services')}
            >
              🎯 Découvrir nos services
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HabitatDetail;
