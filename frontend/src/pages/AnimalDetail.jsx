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

const AnimalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // États composant
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Configuration
  const API_BASE_URL = 'https://zoo-arcadia-ecf.onrender.com/api';

  // Récupérer détail animal
  const fetchAnimal = async () => {
    try {
      console.log('🔍 Chargement animal ID:', id);

      const response = await axios.get(`${API_BASE_URL}/animaux/${id}`);
      console.log('✅ Animal reçu:', response.data);

      setAnimal(response.data);
      setLoading(false);

      //   Incrémenter compteur MongoDB automatiquement et SILENCIEUSEMENT
      await incrementerCompteur();
    } catch (error) {
      console.error('❌ Erreur API animal:', error);
      setError('Animal non trouvé');
      setLoading(false);
    }
  };

  //   Compteur MongoDB INVISIBLE (pas d'affichage visiteur)
  const incrementerCompteur = async () => {
    try {
      await axios.post(`${API_BASE_URL}/animaux/${id}/view`);
      console.log(' Consultation enregistrée dans MongoDB (invisible)');
    } catch (error) {
      console.error(' Erreur compteur MongoDB (non critique):', error);
      // Pas d'affichage d'erreur - US11 doit être invisible pour visiteur
    }
  };

  // Chargement initial
  useEffect(() => {
    if (id) {
      fetchAnimal();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner
          animation="border"
          style={{ color: 'var(--zoo-primary)' }}
          size="lg"
        />
        <p className="mt-3" style={{ color: 'var(--zoo-primary)' }}>
          Chargement des informations...
        </p>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>❌ {error}</Alert.Heading>
          <p>L'animal demandé n'existe pas ou plus.</p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="outline-danger" onClick={fetchAnimal}>
              🔄 Réessayer
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/habitats')}
            >
              ⬅️ Retour aux habitats
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // Animal non trouvé
  if (!animal) {
    return (
      <Container className="mt-5">
        <Alert variant="warning" className="text-center">
          <Alert.Heading>Animal introuvable</Alert.Heading>
          <Button
            variant="outline-warning"
            onClick={() => navigate('/habitats')}
          >
            ⬅️ Retour aux habitats
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link
              to="/"
              style={{ color: 'var(--zoo-primary)', textDecoration: 'none' }}
            >
              Accueil
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link
              to="/habitats"
              style={{ color: 'var(--zoo-primary)', textDecoration: 'none' }}
            >
              Habitats
            </Link>
          </li>
          {animal?.habitat && (
            <li className="breadcrumb-item">
              <Link
                to={`/habitat/${animal.habitat.id}`}
                style={{ color: 'var(--zoo-primary)', textDecoration: 'none' }}
              >
                {animal.habitat.nom}
              </Link>
            </li>
          )}
          <li className="breadcrumb-item active">{animal?.prenom}</li>
        </ol>
      </nav>

      <Row>
        {/* Colonne Image */}
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Img
              variant="top"
              src={animal?.image_url || '/images/default-animal.jpg'}
              alt={animal?.prenom}
              style={{
                height: '400px',
                objectFit: 'cover',
                borderRadius: '15px',
              }}
              onError={(e) => {
                e.target.src = '/images/default-animal.jpg';
              }}
            />
            {/*  PAS D'AFFICHAGE du compteur pour visiteur (US11) */}
          </Card>
        </Col>

        {/* Colonne Informations */}
        <Col lg={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h1
                  className="display-4 mb-0"
                  style={{ color: 'var(--zoo-primary)' }}
                >
                  {animal?.prenom}
                </h1>
                <Badge bg="secondary" className="fs-6">
                  {animal?.race}
                </Badge>
              </div>

              {/* Informations habitat */}
              {animal?.habitat && (
                <Alert variant="info" className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>🏡 Habitat :</strong> {animal.habitat.nom}
                      <br />
                      <small className="text-muted">
                        {animal.habitat.description}
                      </small>
                    </div>
                    <Link
                      to={`/habitat/${animal.habitat.id}`}
                      className="btn btn-outline-info btn-sm"
                    >
                      Voir habitat
                    </Link>
                  </div>
                </Alert>
              )}

              {/* Dernier rapport vétérinaire (US4) */}
              {animal?.rapports && animal.rapports.length > 0 ? (
                <Card className="mb-4 border-success">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0 text-success">
                      🩺 Dernier Rapport Vétérinaire
                    </h5>
                    <small className="text-muted">
                      {new Date(
                        animal.rapports[0].date_passage,
                      ).toLocaleDateString('fr-FR')}
                    </small>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <strong>État :</strong>
                        <Badge
                          bg={
                            animal.rapports[0].etat_animal === 'bon'
                              ? 'success'
                              : 'warning'
                          }
                          className="ms-2"
                        >
                          {animal.rapports[0].etat_animal}
                        </Badge>
                      </Col>
                      <Col md={6}>
                        <strong>Nourriture :</strong>{' '}
                        {animal.rapports[0].nourriture_proposee}
                        <br />
                        <small className="text-muted">
                          Grammage : {animal.rapports[0].grammage_nourriture}g
                        </small>
                      </Col>
                    </Row>
                    {animal.rapports[0].detail_etat && (
                      <div className="mt-3">
                        <strong>Détails :</strong>
                        <p className="mb-0 mt-1">
                          {animal.rapports[0].detail_etat}
                        </p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              ) : (
                <Alert variant="warning">
                  ⚠️ Aucun rapport vétérinaire disponible pour cet animal.
                </Alert>
              )}

              {/* Boutons d'action */}
              <div className="d-flex gap-3 mt-4">
                <Button
                  variant="outline-primary"
                  onClick={() => navigate(-1)}
                  className="flex-grow-1"
                >
                  ⬅️ Retour
                </Button>
                {animal?.habitat && (
                  <Button
                    variant="primary"
                    as={Link}
                    to={`/habitat/${animal.habitat.id}`}
                    className="flex-grow-1 btn-zoo"
                  >
                    🏡 Voir l'habitat
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Section informative (sans mention du compteur) */}
      <Row className="mt-5">
        <Col>
          <Alert variant="light" className="text-center">
            <small className="text-muted">
              💡 <strong>Le saviez-vous ?</strong> Nos vétérinaires passent
              quotidiennement pour s'assurer du bien-être de chaque animal du
              zoo.
            </small>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default AnimalDetail;
