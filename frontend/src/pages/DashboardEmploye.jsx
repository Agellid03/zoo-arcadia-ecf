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
  Form,
  Modal,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * DASHBOARD EMPLOYÉ (US7)
 *
 * FONCTIONNALITÉS :
 * - Validation avis visiteurs (approuver/rejeter)
 * - Enregistrement alimentation animaux
 * - Modification services zoo
 * - Vue d'ensemble activités
 */
const DashboardEmploye = () => {
  const navigate = useNavigate();

  // États des données
  const [avis, setAvis] = useState([]);
  const [animaux, setAnimaux] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États modals
  const [showAlimentationModal, setShowAlimentationModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  // États formulaire alimentation
  const [alimentationForm, setAlimentationForm] = useState({
    date_consommation: new Date().toISOString().split('T')[0],
    heure_consommation: new Date().toTimeString().split(' ')[0].substring(0, 5),
    nourriture_donnee: '',
    quantite: '',
  });

  // Configuration API
  const API_BASE_URL = 'https://zoo-arcadia-ecf.onrender.com/api';
  const user = JSON.parse(localStorage.getItem('zoo_user') || '{}');
  const token = localStorage.getItem('zoo_token');

  const apiHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('zoo_token');
    localStorage.removeItem('zoo_user');
    navigate('/login');
  };

  // Vérification authentification
  useEffect(() => {
    if (!token || user.role !== 'employe') {
      console.log('❌ Accès employé requis, redirection login');
      navigate('/login');
      return;
    }

    console.log('✅ Employé authentifié:', user.email);
    fetchDashboardData();
  }, []);

  // Récupération données dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. RÉCUPÉRER AVIS EN ATTENTE
      console.log('📋 Chargement avis en attente...');
      const avisResponse = await axios.get(`${API_BASE_URL}/avis/all`, {
        headers: apiHeaders,
      });

      setAvis(avisResponse.data.filter((a) => a.statut === 'en_attente'));

      // 2. RÉCUPÉRER LISTE ANIMAUX (pour alimentation)
      console.log('🐾 Chargement liste animaux...');
      const habitatsResponse = await axios.get(`${API_BASE_URL}/habitats`);

      const tousAnimaux = [];
      habitatsResponse.data.forEach((habitat) => {
        if (habitat.animaux) {
          habitat.animaux.forEach((animal) => {
            tousAnimaux.push({
              ...animal,
              habitat_nom: habitat.nom,
            });
          });
        }
      });
      setAnimaux(tousAnimaux);

      // 3. RÉCUPÉRER SERVICES
      console.log('🎯 Chargement services...');
      const servicesResponse = await axios.get(`${API_BASE_URL}/services`);
      setServices(servicesResponse.data);
    } catch (error) {
      console.error('❌ Erreur chargement dashboard:', error);
      setError('Erreur chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Valider/Rejeter avis
  const handleAvisAction = async (avisId, statut) => {
    try {
      console.log(`📝 ${statut} avis ID: ${avisId}`);

      await axios.put(
        `${API_BASE_URL}/avis/${avisId}`,
        { statut },
        { headers: apiHeaders },
      );

      // Rafraîchir la liste
      setAvis((prev) => prev.filter((a) => a.id !== avisId));

      console.log('✅ Avis traité avec succès');
    } catch (error) {
      console.error('❌ Erreur traitement avis:', error);
      setError("Erreur lors du traitement de l'avis");
    }
  };

  // Ouvrir modal alimentation
  const openAlimentationModal = (animal) => {
    setSelectedAnimal(animal);
    setAlimentationForm({
      date_consommation: new Date().toISOString().split('T')[0],
      heure_consommation: new Date()
        .toTimeString()
        .split(' ')[0]
        .substring(0, 5),
      nourriture_donnee: '',
      quantite: '',
    });
    setShowAlimentationModal(true);
  };

  // Enregistrer alimentation
  const handleAlimentationSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('🍽️ Enregistrement alimentation:', selectedAnimal.prenom);

      await axios.post(
        `${API_BASE_URL}/consommations`,
        {
          animal_id: selectedAnimal.id,
          ...alimentationForm,
        },
        { headers: apiHeaders },
      );

      setShowAlimentationModal(false);
      console.log('✅ Alimentation enregistrée'); // Optionnel
    } catch (error) {
      console.error('❌ Erreur enregistrement alimentation:', error);
      setError("Erreur lors de l'enregistrement");
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner
          animation="border"
          style={{ color: 'var(--zoo-primary)' }}
          size="lg"
        />
        <p className="mt-3">Chargement dashboard employé...</p>
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
                👷 Dashboard Employé
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

      {/* ERREUR GLOBALE */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* VALIDATION AVIS VISITEURS (US7) */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">
                📝 Avis en attente de validation ({avis.length})
              </h5>
            </Card.Header>
            <Card.Body>
              {avis.length > 0 ? (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Pseudo</th>
                      <th>Avis</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {avis.map((avisItem) => (
                      <tr key={avisItem.id}>
                        <td>
                          <strong>{avisItem.pseudo}</strong>
                        </td>
                        <td>
                          <div style={{ maxWidth: '300px' }}>
                            {avisItem.texte.length > 100
                              ? `${avisItem.texte.substring(0, 100)}...`
                              : avisItem.texte}
                          </div>
                        </td>
                        <td>
                          <small className="text-muted">
                            {new Date(avisItem.createdAt).toLocaleDateString(
                              'fr-FR',
                            )}
                          </small>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() =>
                                handleAvisAction(avisItem.id, 'approuve')
                              }
                            >
                              ✅ Approuver
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() =>
                                handleAvisAction(avisItem.id, 'rejete')
                              }
                            >
                              ❌ Rejeter
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info" className="text-center">
                  📭 Aucun avis en attente de validation.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ALIMENTATION ANIMAUX (US7) */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">🍽️ Alimentation des Animaux</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-3">
                Enregistrez la nourriture donnée aux animaux avec quantité et
                horaire.
              </p>

              <Row>
                {animaux.slice(0, 6).map((animal) => (
                  <Col md={4} className="mb-3" key={animal.id}>
                    <Card className="border-1">
                      <Card.Body className="text-center">
                        <h6 className="mb-1">{animal.prenom}</h6>
                        <small className="text-muted">
                          {animal.race} - {animal.habitat_nom}
                        </small>
                        <br />
                        <Button
                          size="sm"
                          variant="outline-success"
                          className="mt-2"
                          onClick={() => openAlimentationModal(animal)}
                        >
                          🍽️ Nourrir
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {animaux.length > 6 && (
                <div className="text-center">
                  <small className="text-muted">
                    ... et {animaux.length - 6} autres animaux
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* GESTION SERVICES (US7) */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">🎯 Services du Zoo ({services.length})</h5>
            </Card.Header>
            <Card.Body>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td>
                        <strong>{service.nom}</strong>
                      </td>
                      <td>{service.description}</td>
                      <td>
                        <Button size="sm" variant="outline-primary" disabled>
                          ✏️ Modifier
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MODAL ALIMENTATION */}
      <Modal
        show={showAlimentationModal}
        onHide={() => setShowAlimentationModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>🍽️ Alimentation - {selectedAnimal?.prenom}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAlimentationSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date :</Form.Label>
                  <Form.Control
                    type="date"
                    value={alimentationForm.date_consommation}
                    onChange={(e) =>
                      setAlimentationForm((prev) => ({
                        ...prev,
                        date_consommation: e.target.value,
                      }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Heure :</Form.Label>
                  <Form.Control
                    type="time"
                    value={alimentationForm.heure_consommation}
                    onChange={(e) =>
                      setAlimentationForm((prev) => ({
                        ...prev,
                        heure_consommation: e.target.value,
                      }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Nourriture donnée :</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Foin, viande, croquettes..."
                value={alimentationForm.nourriture_donnee}
                onChange={(e) =>
                  setAlimentationForm((prev) => ({
                    ...prev,
                    nourriture_donnee: e.target.value,
                  }))
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantité (kg) :</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                placeholder="Ex: 2.5"
                value={alimentationForm.quantite}
                onChange={(e) =>
                  setAlimentationForm((prev) => ({
                    ...prev,
                    quantite: e.target.value,
                  }))
                }
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAlimentationModal(false)}
          >
            Annuler
          </Button>
          <Button variant="success" onClick={handleAlimentationSubmit}>
            📝 Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DashboardEmploye;
