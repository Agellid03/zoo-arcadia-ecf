import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Alert,
  Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GestionUtilisateurs from '../components/GestionUtilisateurs';
import GestionHabitats from '../components/GestionHabitats';
import GestionAnimaux from '../components/GestionAnimaux';
import GestionServices from '../components/GestionServices';

/**
 * DASHBOARD ADMINISTRATEUR (US6)
 *
 * FONCTIONNALITÉS :
 * - Statistiques consultations animaux (US11)
 * - Gestion utilisateurs
 * - Vue d'ensemble rapports vétérinaires
 * - Navigation vers gestion contenus
 */
const DashboardAdmin = () => {
  const navigate = useNavigate();

  // États des données
  const [stats, setStats] = useState(null);
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGestionUtilisateurs, setShowGestionUtilisateurs] = useState(false);
  const [showGestionHabitats, setShowGestionHabitats] = useState(false);
  const [showGestionAnimaux, setShowGestionAnimaux] = useState(false);
  const [showGestionServices, setShowGestionServices] = useState(false);

  const API_BASE_URL = 'https://zoo-arcadia-ecf.onrender.com/api';

  // Récupérer données utilisateur stockées
  const user = JSON.parse(localStorage.getItem('zoo_user') || '{}');
  const token = localStorage.getItem('zoo_token');

  const apiHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const handleLogout = () => {
    localStorage.removeItem('zoo_token');
    localStorage.removeItem('zoo_user');
    navigate('/login');
  };

  useEffect(() => {
    if (!token || user.role !== 'admin') {
      console.log(' Accès non autorisé.');
      navigate('/connexion');
      return;
    }

    console.log(' Admin authentifié:', user.email);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      console.log(' Chargement statistiques MongoDB...');
      const statsResponse = await axios.get(`${API_BASE_URL}/dashboard/stats`, {
        headers: apiHeaders,
      });

      console.log(' Stats reçues:', statsResponse.data);
      setStats(statsResponse.data);

      console.log(' Chargement rapports vétérinaires...');
      const rapportsResponse = await axios.get(`${API_BASE_URL}/rapports`, {
        headers: apiHeaders,
      });

      console.log(' Rapports reçus:', rapportsResponse.data);
      setRapports(rapportsResponse.data.slice(0, 5));
    } catch (error) {
      console.error(' Erreur chargement dashboard:', error);

      if (error.response?.status === 403) {
        setError('Accès refusé - Admin requis');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Erreur chargement des données');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner
          animation="border"
          style={{ color: 'var(--zoo-primary)' }}
          size="lg"
        />
        <p className="mt-3">Chargement dashboard administrateur...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <h4>❌ {error}</h4>
          <Button variant="outline-danger" onClick={() => navigate('/login')}>
            Retour connexion
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* HEADER DASHBOARD */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 style={{ color: 'var(--zoo-primary)' }}>
                👑 Dashboard Administrateur
              </h1>
              <p className="text-muted mb-0">
                Bienvenue <strong>{user.email}</strong>
              </p>
            </div>
            <Button variant="outline-danger" onClick={handleLogout}>
              🚪 Déconnexion
            </Button>
          </div>
        </Col>
      </Row>

      {/* STATISTIQUES CONSULTATIONS ANIMAUX (US11) */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                📊 Statistiques Consultations Animaux (US11)
              </h5>
            </Card.Header>
            <Card.Body>
              {stats ? (
                <>
                  {/* MÉTRIQUES GLOBALES */}
                  <Row className="mb-4">
                    <Col md={4} className="text-center">
                      <h3 className="text-primary">
                        {stats.total_consultations}
                      </h3>
                      <p className="text-muted mb-0">Total consultations</p>
                    </Col>
                    <Col md={4} className="text-center">
                      <h3 className="text-success">{stats.stats_count}</h3>
                      <p className="text-muted mb-0">Animaux consultés</p>
                    </Col>
                    <Col md={4} className="text-center">
                      <h3 className="text-warning">{stats.most_popular}</h3>
                      <p className="text-muted mb-0">
                        Animal le plus populaire
                      </p>
                    </Col>
                  </Row>

                  {/* TOP ANIMAUX CONSULTÉS */}
                  <h6 className="mb-3">🏆 Top animaux les plus consultés :</h6>
                  <Table striped hover responsive>
                    <thead>
                      <tr>
                        <th>Rang</th>
                        <th>Animal</th>
                        <th>Consultations</th>
                        <th>Dernière vue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.animals_stats.slice(0, 10).map((animal, index) => (
                        <tr key={animal.animal_id}>
                          <td>
                            <Badge bg={index < 3 ? 'warning' : 'secondary'}>
                              #{index + 1}
                            </Badge>
                          </td>
                          <td>
                            <strong>{animal.animal_name}</strong>
                          </td>
                          <td>
                            <Badge bg="info">{animal.views} vues</Badge>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(animal.last_viewed).toLocaleDateString(
                                'fr-FR',
                              )}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              ) : (
                <Alert variant="info">
                  Aucune statistique disponible pour le moment.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* DERNIERS RAPPORTS VÉTÉRINAIRES */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">🩺 Derniers Rapports Vétérinaires</h5>
            </Card.Header>
            <Card.Body>
              {rapports.length > 0 ? (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Animal</th>
                      <th>État</th>
                      <th>Vétérinaire</th>
                      <th>Nourriture</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rapports.map((rapport) => (
                      <tr key={rapport.id}>
                        <td>
                          {new Date(rapport.date_passage).toLocaleDateString(
                            'fr-FR',
                          )}
                        </td>
                        <td>
                          <strong>{rapport.animal?.prenom || 'N/A'}</strong>
                        </td>
                        <td>
                          <Badge
                            bg={
                              rapport.etat_animal === 'bon'
                                ? 'success'
                                : 'warning'
                            }
                          >
                            {rapport.etat_animal}
                          </Badge>
                        </td>
                        <td>{rapport.veterinaire?.email || 'N/A'}</td>
                        <td>
                          {rapport.nourriture_proposee}
                          <small className="text-muted">
                            {' '}
                            ({rapport.grammage_nourriture}g)
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  Aucun rapport vétérinaire disponible.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ACTIONS RAPIDES */}
      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">⚡ Actions Rapides</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-3">
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={() => setShowGestionUtilisateurs(true)}
                  >
                    👥 Gérer Utilisateurs
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button
                    variant="outline-success"
                    className="w-100"
                    onClick={() => setShowGestionHabitats(true)}
                  >
                    🏡 Gérer Habitats
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button
                    variant="outline-info"
                    className="w-100"
                    onClick={() => setShowGestionAnimaux(true)}
                  >
                    🐾 Gérer Animaux
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button
                    variant="outline-secondary"
                    className="w-100"
                    onClick={() => setShowGestionServices(true)}
                  >
                    🎯 Gérer Services
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <GestionUtilisateurs
        show={showGestionUtilisateurs}
        onHide={() => setShowGestionUtilisateurs(false)}
      />
      {/* MODAL GESTION HABITATS */}
      <GestionHabitats
        show={showGestionHabitats}
        onHide={() => setShowGestionHabitats(false)}
      />
      {/* MODAL GESTION ANIMAUX */}
      <GestionAnimaux
        show={showGestionAnimaux}
        onHide={() => setShowGestionAnimaux(false)}
      />
      {/* MODAL GESTION SERVICES */}
      <GestionServices
        show={showGestionServices}
        onHide={() => setShowGestionServices(false)}
      />
    </Container>
  );
};

export default DashboardAdmin;
