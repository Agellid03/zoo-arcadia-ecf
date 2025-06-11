import React, { useState, useEffect } from 'react';
import {
  Modal,
  Table,
  Button,
  Form,
  Alert,
  Spinner,
  Badge,
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import axios from 'axios';

/**
 * COMPOSANT GESTION ANIMAUX (US6 - Admin)
 *
 * FONCTIONNALITÉS :
 * - CRUD complet animaux
 * - Création animal avec assignation habitat
 * - Modification animaux existants
 * - Suppression animaux
 * - Interface avec preview et groupement par habitat
 */
const GestionAnimaux = ({ show, onHide }) => {
  // États des données
  const [animaux, setAnimaux] = useState([]);
  const [habitats, setHabitats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // États modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // États formulaires
  const [createForm, setCreateForm] = useState({
    prenom: '',
    race: '',
    habitat_id: '',
    image_url: '',
  });

  const [editForm, setEditForm] = useState({
    prenom: '',
    race: '',
    habitat_id: '',
    image_url: '',
  });

  // Configuration API
  const API_BASE_URL = 'https://zoo-arcadia-ecf.onrender.com/api';
  const token = localStorage.getItem('zoo_token');

  const apiHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // ==========================================
  // FONCTIONS UTILITAIRES
  // ==========================================

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const showSuccessMessage = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const resetCreateForm = () => {
    setCreateForm({
      prenom: '',
      race: '',
      habitat_id: '',
      image_url: '',
    });
  };

  // ==========================================
  // OPÉRATIONS CRUD
  // ==========================================

  // Charger habitats et animaux
  const fetchData = async () => {
    try {
      setLoading(true);
      resetMessages();

      console.log('🐾 Chargement animaux et habitats...');

      // Charger habitats avec animaux
      const habitatsResponse = await axios.get(`${API_BASE_URL}/habitats`);
      setHabitats(habitatsResponse.data);

      // Extraire tous les animaux
      const tousAnimaux = [];
      habitatsResponse.data.forEach((habitat) => {
        if (habitat.animaux) {
          habitat.animaux.forEach((animal) => {
            tousAnimaux.push({
              ...animal,
              habitat_nom: habitat.nom,
              habitat_id: habitat.id,
            });
          });
        }
      });

      setAnimaux(tousAnimaux);
      console.log('✅ Données chargées:', {
        habitats: habitatsResponse.data,
        animaux: tousAnimaux,
      });
    } catch (error) {
      console.error('❌ Erreur chargement données:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Créer animal
  const handleCreateAnimal = async (e) => {
    e.preventDefault();

    try {
      resetMessages();
      console.log('➕ Création animal:', createForm.prenom);

      await axios.post(`${API_BASE_URL}/animaux`, createForm, {
        headers: apiHeaders,
      });

      // Succès
      showSuccessMessage(`Animal "${createForm.prenom}" créé avec succès !`);
      setShowCreateModal(false);
      resetCreateForm();
      fetchData(); // Rafraîchir les données
    } catch (error) {
      console.error('❌ Erreur création animal:', error);
      setError(error.response?.data?.error || 'Erreur lors de la création');
    }
  };

  // Modifier animal
  const handleEditAnimal = async (e) => {
    e.preventDefault();

    try {
      resetMessages();
      console.log('✏️ Modification animal ID:', selectedAnimal.id);

      await axios.put(
        `${API_BASE_URL}/animaux/${selectedAnimal.id}`,
        editForm,
        {
          headers: apiHeaders,
        },
      );

      // Succès
      showSuccessMessage(`Animal "${editForm.prenom}" modifié avec succès !`);
      setShowEditModal(false);
      setSelectedAnimal(null);
      fetchData(); // Rafraîchir les données
    } catch (error) {
      console.error('❌ Erreur modification animal:', error);
      setError(error.response?.data?.error || 'Erreur lors de la modification');
    }
  };

  // Supprimer animal
  const handleDeleteAnimal = async (animalId) => {
    try {
      resetMessages();
      console.log('🗑️ Suppression animal ID:', animalId);

      await axios.delete(`${API_BASE_URL}/animaux/${animalId}`, {
        headers: apiHeaders,
      });

      // Succès
      showSuccessMessage('Animal supprimé avec succès !');
      setConfirmDelete(null);
      fetchData(); // Rafraîchir les données
    } catch (error) {
      console.error('❌ Erreur suppression animal:', error);
      setError(error.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  // ==========================================
  // HANDLERS MODALS
  // ==========================================

  // Ouvrir modal création
  const openCreateModal = () => {
    resetCreateForm();
    setShowCreateModal(true);
  };

  // Ouvrir modal édition
  const openEditModal = (animal) => {
    setSelectedAnimal(animal);
    setEditForm({
      prenom: animal.prenom,
      race: animal.race,
      habitat_id: animal.habitat_id.toString(),
      image_url: animal.image_url || '',
    });
    setShowEditModal(true);
  };

  // Confirmer suppression
  const openDeleteConfirm = (animal) => {
    setConfirmDelete(animal);
  };

  // ==========================================
  // HANDLERS FORMULAIRES
  // ==========================================

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // GROUPEMENT PAR HABITAT
  // ==========================================

  const getAnimauxParHabitat = () => {
    const groupes = {};

    habitats.forEach((habitat) => {
      groupes[habitat.nom] = animaux.filter(
        (animal) => animal.habitat_id === habitat.id,
      );
    });

    return groupes;
  };

  // ==========================================
  // EFFECTS
  // ==========================================

  useEffect(() => {
    if (show) {
      fetchData();
    }
  }, [show]);

  // ==========================================
  // RENDER
  // ==========================================

  const animauxParHabitat = getAnimauxParHabitat();

  return (
    <>
      {/* MODAL PRINCIPAL GESTION ANIMAUX */}
      <Modal show={show} onHide={onHide} size="xl" backdrop="static">
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>🐾 Gestion des Animaux</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* MESSAGES D'ÉTAT */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              <strong>❌ Erreur :</strong> {error}
            </Alert>
          )}

          {success && (
            <Alert
              variant="success"
              dismissible
              onClose={() => setSuccess(null)}
            >
              <strong>✅ Succès :</strong> {success}
            </Alert>
          )}

          {/* BOUTON CRÉER ANIMAL */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Tous les animaux ({animaux.length})</h5>
            <Button variant="info" onClick={openCreateModal}>
              ➕ Ajouter animal
            </Button>
          </div>

          {/* AFFICHAGE PAR HABITAT */}
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="info" />
              <p className="mt-2">Chargement des animaux...</p>
            </div>
          ) : (
            Object.entries(animauxParHabitat).map(
              ([habitatNom, animauxHabitat]) => (
                <div key={habitatNom} className="mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="text-info mb-0">🏡 {habitatNom}</h6>
                    <Badge bg="secondary">
                      {animauxHabitat.length} animal(x)
                    </Badge>
                  </div>

                  {animauxHabitat.length > 0 ? (
                    <Row>
                      {animauxHabitat.map((animal) => (
                        <Col md={6} lg={4} key={animal.id} className="mb-3">
                          <Card className="h-100 shadow-sm">
                            {animal.image_url && (
                              <Card.Img
                                variant="top"
                                src={animal.image_url}
                                style={{ height: '120px', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                            <Card.Body className="d-flex flex-column">
                              <Card.Title className="text-info h6">
                                🐾 {animal.prenom}
                              </Card.Title>

                              <Card.Text className="small flex-grow-1">
                                <strong>Race:</strong> {animal.race}
                              </Card.Text>

                              <div className="d-flex gap-2 mt-auto">
                                <Button
                                  size="sm"
                                  variant="outline-warning"
                                  onClick={() => openEditModal(animal)}
                                  className="flex-grow-1"
                                >
                                  ✏️ Modifier
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => openDeleteConfirm(animal)}
                                >
                                  🗑️
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Alert variant="light" className="text-center">
                      Aucun animal dans cet habitat
                    </Alert>
                  )}
                </div>
              ),
            )
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL CRÉATION ANIMAL */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>➕ Ajouter un animal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateAnimal}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prénom de l'animal :</Form.Label>
                  <Form.Control
                    type="text"
                    name="prenom"
                    placeholder="Ex: Simba"
                    value={createForm.prenom}
                    onChange={handleCreateFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Race :</Form.Label>
                  <Form.Control
                    type="text"
                    name="race"
                    placeholder="Ex: Lion d'Afrique"
                    value={createForm.race}
                    onChange={handleCreateFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Habitat :</Form.Label>
              <Form.Select
                name="habitat_id"
                value={createForm.habitat_id}
                onChange={handleCreateFormChange}
                required
              >
                <option value="">Sélectionner un habitat</option>
                {habitats.map((habitat) => (
                  <option key={habitat.id} value={habitat.id}>
                    {habitat.nom}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de l'image (optionnel) :</Form.Label>
              <Form.Control
                type="url"
                name="image_url"
                placeholder="https://example.com/animal.jpg"
                value={createForm.image_url}
                onChange={handleCreateFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Annuler
          </Button>
          <Button variant="info" onClick={handleCreateAnimal}>
            ➕ Ajouter
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL ÉDITION ANIMAL */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>✏️ Modifier l'animal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditAnimal}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prénom de l'animal :</Form.Label>
                  <Form.Control
                    type="text"
                    name="prenom"
                    value={editForm.prenom}
                    onChange={handleEditFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Race :</Form.Label>
                  <Form.Control
                    type="text"
                    name="race"
                    value={editForm.race}
                    onChange={handleEditFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Habitat :</Form.Label>
              <Form.Select
                name="habitat_id"
                value={editForm.habitat_id}
                onChange={handleEditFormChange}
                required
              >
                {habitats.map((habitat) => (
                  <option key={habitat.id} value={habitat.id}>
                    {habitat.nom}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de l'image :</Form.Label>
              <Form.Control
                type="url"
                name="image_url"
                value={editForm.image_url}
                onChange={handleEditFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Annuler
          </Button>
          <Button variant="warning" onClick={handleEditAnimal}>
            ✏️ Modifier
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL CONFIRMATION SUPPRESSION */}
      <Modal
        show={!!confirmDelete}
        onHide={() => setConfirmDelete(null)}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>🗑️ Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <strong>⚠️ Attention !</strong>
            <br />
            Vous êtes sur le point de supprimer l'animal{' '}
            <strong>"{confirmDelete?.prenom}"</strong> ({confirmDelete?.race}).
            <br />
            <br />
            Cette action est <strong>irréversible</strong> et supprimera
            également :
            <ul className="mt-2">
              <li>Tous les rapports vétérinaires associés</li>
              <li>L'historique d'alimentation</li>
              <li>Les statistiques de consultation</li>
            </ul>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteAnimal(confirmDelete.id)}
          >
            🗑️ Supprimer définitivement
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GestionAnimaux;
