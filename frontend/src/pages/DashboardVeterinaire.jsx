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
 * DASHBOARD VÉTÉRINAIRE (US8)
 *
 * FONCTIONNALITÉS :
 * - Création rapports vétérinaires par animal
 * - Ajout commentaires sur habitats
 * - Consultation alimentation donnée par employés
 * - Vue d'ensemble santé animaux
 */
const DashboardVeterinaire = () => {
  const navigate = useNavigate();

  // États des données
  const [animaux, setAnimaux] = useState([]);
  const [habitats, setHabitats] = useState([]);
  const [consommations, setConsommations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États modals
  const [showRapportModal, setShowRapportModal] = useState(false);
  const [showCommentaireModal, setShowCommentaireModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedHabitat, setSelectedHabitat] = useState(null);

  // États formulaires
  const [rapportForm, setRapportForm] = useState({
    etat_animal: 'bon',
    nourriture_proposee: '',
    grammage_nourriture: '',
    date_passage: new Date().toISOString().split('T')[0],
    detail_etat: '',
  });

  const [commentaireForm, setCommentaireForm] = useState({
    commentaire: '',
    statut_habitat: 'bon',
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
    if (!token || user.role !== 'veterinaire') {
      console.log('❌ Accès vétérinaire requis, redirection login');
      navigate('/login');
      return;
    }

    console.log('✅ Vétérinaire authentifié:', user.email);
    fetchDashboardData();
  }, []);

  // Récupération données dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. RÉCUPÉRER HABITATS + ANIMAUX
      console.log('🏡 Chargement habitats et animaux...');
      const habitatsResponse = await axios.get(`${API_BASE_URL}/habitats`);
      setHabitats(habitatsResponse.data);

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

      // 2. RÉCUPÉRER CONSOMMATIONS (US8)
      console.log('🍽️ Chargement consommations alimentaires...');
      const consommationsResponse = await axios.get(
        `${API_BASE_URL}/consommations`,
        {
          headers: apiHeaders,
        },
      );
      setConsommations(consommationsResponse.data.slice(0, 10)); // 10 dernières
    } catch (error) {
      console.error('❌ Erreur chargement dashboard:', error);
      setError('Erreur chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir modal rapport
  const openRapportModal = (animal) => {
    setSelectedAnimal(animal);
    setRapportForm({
      etat_animal: 'bon',
      nourriture_proposee: '',
      grammage_nourriture: '',
      date_passage: new Date().toISOString().split('T')[0],
      detail_etat: '',
    });
    setShowRapportModal(true);
  };

  // Créer rapport vétérinaire
  const handleRapportSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('🩺 Création rapport pour:', selectedAnimal.prenom);

      await axios.post(
        `${API_BASE_URL}/rapports`,
        {
          animal_id: selectedAnimal.id,
          ...rapportForm,
        },
        { headers: apiHeaders },
      );

      setShowRapportModal(false);
      console.log('✅ Rapport vétérinaire créé');
    } catch (error) {
      console.error('❌ Erreur création rapport:', error);
      setError('Erreur lors de la création du rapport');
    }
  };

  // Ouvrir modal commentaire habitat
  const openCommentaireModal = (habitat) => {
    setSelectedHabitat(habitat);
    setCommentaireForm({
      commentaire: '',
      statut_habitat: 'bon',
    });
    setShowCommentaireModal(true);
  };

  // Créer commentaire habitat
  const handleCommentaireSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('💬 Ajout commentaire habitat:', selectedHabitat.nom);

      await axios.post(
        `${API_BASE_URL}/habitats/${selectedHabitat.id}/commentaires`,
        commentaireForm,
        { headers: apiHeaders },
      );

      setShowCommentaireModal(false);
      console.log('✅ Commentaire habitat ajouté');
    } catch (error) {
      console.error('❌ Erreur ajout commentaire:', error);
      setError("Erreur lors de l'ajout du commentaire");
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
        <p className="mt-3">Chargement dashboard vétérinaire...</p>
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
                🩺 Dashboard Vétérinaire
              </h1>
              <p className="text-muted mb-0">
                Bienvenue Dr. <strong>{user.email}</strong>
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

      {/* RAPPORTS VÉTÉRINAIRES PAR ANIMAL (US8) */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                🩺 Rapports Vétérinaires - Animaux ({animaux.length})
              </h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-3">
                Créez des rapports de santé pour chaque animal du zoo.
              </p>

              <Row>
                {animaux.map((animal) => (
                  <Col md={4} className="mb-3" key={animal.id}>
                    <Card className="border-1">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{animal.prenom}</h6>
                            <small className="text-muted">{animal.race}</small>
                            <br />
                            <Badge bg="info" className="mt-1">
                              {animal.habitat_nom}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => openRapportModal(animal)}
                          >
                            📋 Rapport
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* COMMENTAIRES HABITATS (US8) */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">
                🏡 Commentaires Habitats ({habitats.length})
              </h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-3">
                Ajoutez des avis sur l'état des habitats pour amélioration.
              </p>

              <Row>
                {habitats.map((habitat) => (
                  <Col md={6} className="mb-3" key={habitat.id}>
                    <Card className="border-1">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{habitat.nom}</h6>
                            <small className="text-muted">
                              {habitat.animaux?.length || 0} animaux
                            </small>
                            <br />
                            <small className="text-muted">
                              {habitat.description.substring(0, 60)}...
                            </small>
                          </div>
                          <Button
                            size="sm"
                            variant="outline-warning"
                            onClick={() => openCommentaireModal(habitat)}
                          >
                            💬 Commenter
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* SUIVI ALIMENTATION (US8) */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                🍽️ Suivi Alimentation - Dernières consommations
              </h5>
            </Card.Header>
            <Card.Body>
              {consommations.length > 0 ? (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Animal</th>
                      <th>Date</th>
                      <th>Heure</th>
                      <th>Nourriture</th>
                      <th>Quantité</th>
                      <th>Employé</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consommations.map((conso) => (
                      <tr key={conso.id}>
                        <td>
                          <strong>{conso.animal?.prenom || 'N/A'}</strong>
                        </td>
                        <td>
                          {new Date(conso.date_consommation).toLocaleDateString(
                            'fr-FR',
                          )}
                        </td>
                        <td>{conso.heure_consommation}</td>
                        <td>{conso.nourriture_donnee}</td>
                        <td>
                          <Badge bg="secondary">{conso.quantite} kg</Badge>
                        </td>
                        <td>
                          <small className="text-muted">
                            {conso.employe?.email || 'N/A'}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info" className="text-center">
                  📭 Aucune consommation enregistrée récemment.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MODAL RAPPORT VÉTÉRINAIRE */}
      <Modal
        show={showRapportModal}
        onHide={() => setShowRapportModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            🩺 Rapport Vétérinaire - {selectedAnimal?.prenom}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRapportSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>État animal :</Form.Label>
                  <Form.Select
                    value={rapportForm.etat_animal}
                    onChange={(e) =>
                      setRapportForm((prev) => ({
                        ...prev,
                        etat_animal: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="bon">Bon</option>
                    <option value="moyen">Moyen</option>
                    <option value="mauvais">Mauvais</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de passage :</Form.Label>
                  <Form.Control
                    type="date"
                    value={rapportForm.date_passage}
                    onChange={(e) =>
                      setRapportForm((prev) => ({
                        ...prev,
                        date_passage: e.target.value,
                      }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Nourriture proposée :</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: Foin premium, viande fraîche..."
                    value={rapportForm.nourriture_proposee}
                    onChange={(e) =>
                      setRapportForm((prev) => ({
                        ...prev,
                        nourriture_proposee: e.target.value,
                      }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Grammage (g) :</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ex: 2500"
                    value={rapportForm.grammage_nourriture}
                    onChange={(e) =>
                      setRapportForm((prev) => ({
                        ...prev,
                        grammage_nourriture: e.target.value,
                      }))
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Détail de l'état (optionnel) :</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Observations particulières, recommandations..."
                value={rapportForm.detail_etat}
                onChange={(e) =>
                  setRapportForm((prev) => ({
                    ...prev,
                    detail_etat: e.target.value,
                  }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRapportModal(false)}
          >
            Annuler
          </Button>
          <Button variant="success" onClick={handleRapportSubmit}>
            📋 Créer Rapport
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL COMMENTAIRE HABITAT */}
      <Modal
        show={showCommentaireModal}
        onHide={() => setShowCommentaireModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            💬 Commentaire Habitat - {selectedHabitat?.nom}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCommentaireSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Statut habitat :</Form.Label>
              <Form.Select
                value={commentaireForm.statut_habitat}
                onChange={(e) =>
                  setCommentaireForm((prev) => ({
                    ...prev,
                    statut_habitat: e.target.value,
                  }))
                }
                required
              >
                <option value="bon">Bon état</option>
                <option value="moyen">État moyen</option>
                <option value="mauvais">Mauvais état</option>
                <option value="renovation_requise">Rénovation requise</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Commentaire :</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Observations sur l'habitat, recommandations d'amélioration..."
                value={commentaireForm.commentaire}
                onChange={(e) =>
                  setCommentaireForm((prev) => ({
                    ...prev,
                    commentaire: e.target.value,
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
            onClick={() => setShowCommentaireModal(false)}
          >
            Annuler
          </Button>
          <Button variant="warning" onClick={handleCommentaireSubmit}>
            💬 Ajouter Commentaire
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DashboardVeterinaire;
