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
 * COMPOSANT GESTION HABITATS (US6 - Admin)
 *
 * FONCTIONNALITÉS :
 * - CRUD complet habitats
 * - Création habitat avec toutes propriétés
 * - Modification habitats existants
 * - Suppression habitats (avec vérification animaux)
 * - Interface responsive avec preview
 */
const GestionHabitats = ({ show, onHide }) => {
  // États des données
  const [habitats, setHabitats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // États modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHabitat, setSelectedHabitat] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // États formulaires
  const [createForm, setCreateForm] = useState({
    nom: '',
    description: '',
    superficie: '',
    temperature: '',
    visiteurs_par_jour: '',
    image_url: '',
  });

  const [editForm, setEditForm] = useState({
    nom: '',
    description: '',
    superficie: '',
    temperature: '',
    visiteurs_par_jour: '',
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
      nom: '',
      description: '',
      superficie: '',
      temperature: '',
      visiteurs_par_jour: '',
      image_url: '',
    });
  };

  // ==========================================
  // OPÉRATIONS CRUD
  // ==========================================

  // Charger tous les habitats
  const fetchHabitats = async () => {
    try {
      setLoading(true);
      resetMessages();

      console.log('🏡 Chargement habitats...');

      const response = await axios.get(`${API_BASE_URL}/habitats`);

      setHabitats(response.data);
      console.log('✅ Habitats chargés:', response.data);
    } catch (error) {
      console.error('❌ Erreur chargement habitats:', error);
      setError('Erreur lors du chargement des habitats');
    } finally {
      setLoading(false);
    }
  };

  // Créer habitat
  const handleCreateHabitat = async (e) => {
    e.preventDefault();

    try {
      resetMessages();
      console.log('➕ Création habitat:', createForm.nom);

      await axios.post(`${API_BASE_URL}/habitats`, createForm, {
        headers: apiHeaders,
      });

      // Succès
      showSuccessMessage(`Habitat "${createForm.nom}" créé avec succès !`);
      setShowCreateModal(false);
      resetCreateForm();
      fetchHabitats(); // Rafraîchir la liste
    } catch (error) {
      console.error('❌ Erreur création habitat:', error);
      setError(error.response?.data?.error || 'Erreur lors de la création');
    }
  };

  // Modifier habitat
  const handleEditHabitat = async (e) => {
    e.preventDefault();

    try {
      resetMessages();
      console.log('✏️ Modification habitat ID:', selectedHabitat.id);

      await axios.put(
        `${API_BASE_URL}/habitats/${selectedHabitat.id}`,
        editForm,
        {
          headers: apiHeaders,
        },
      );

      // Succès
      showSuccessMessage(`Habitat "${editForm.nom}" modifié avec succès !`);
      setShowEditModal(false);
      setSelectedHabitat(null);
      fetchHabitats(); // Rafraîchir la liste
    } catch (error) {
      console.error('❌ Erreur modification habitat:', error);
      setError(error.response?.data?.error || 'Erreur lors de la modification');
    }
  };

  // Supprimer habitat
  const handleDeleteHabitat = async (habitatId) => {
    try {
      resetMessages();
      console.log('🗑️ Suppression habitat ID:', habitatId);

      await axios.delete(`${API_BASE_URL}/habitats/${habitatId}`, {
        headers: apiHeaders,
      });

      // Succès
      showSuccessMessage('Habitat supprimé avec succès !');
      setConfirmDelete(null);
      fetchHabitats(); // Rafraîchir la liste
    } catch (error) {
      console.error('❌ Erreur suppression habitat:', error);
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
  const openEditModal = (habitat) => {
    setSelectedHabitat(habitat);
    setEditForm({
      nom: habitat.nom,
      description: habitat.description,
      superficie: habitat.superficie,
      temperature: habitat.temperature,
      visiteurs_par_jour: habitat.visiteurs_par_jour,
      image_url: habitat.image_url || '',
    });
    setShowEditModal(true);
  };

  // Confirmer suppression
  const openDeleteConfirm = (habitat) => {
    setConfirmDelete(habitat);
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
  // EFFECTS
  // ==========================================

  useEffect(() => {
    if (show) {
      fetchHabitats();
    }
  }, [show]);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <>
      {/* MODAL PRINCIPAL GESTION HABITATS */}
      <Modal show={show} onHide={onHide} size="xl" backdrop="static">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>🏡 Gestion des Habitats</Modal.Title>
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

          {/* BOUTON CRÉER HABITAT */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Liste des habitats ({habitats.length})</h5>
            <Button variant="success" onClick={openCreateModal}>
              ➕ Créer habitat
            </Button>
          </div>

          {/* GRILLE HABITATS */}
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="success" />
              <p className="mt-2">Chargement des habitats...</p>
            </div>
          ) : (
            <Row>
              {habitats.map((habitat) => (
                <Col md={6} lg={4} key={habitat.id} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    {habitat.image_url && (
                      <Card.Img
                        variant="top"
                        src={habitat.image_url}
                        style={{ height: '150px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="text-success">
                        {habitat.nom}
                      </Card.Title>

                      <Card.Text className="flex-grow-1 small">
                        {habitat.description.length > 80
                          ? `${habitat.description.substring(0, 80)}...`
                          : habitat.description}
                      </Card.Text>

                      <div className="mb-3">
                        <small className="text-muted d-block">
                          📏 Superficie: {habitat.superficie}
                        </small>
                        <small className="text-muted d-block">
                          🌡️ Température: {habitat.temperature}
                        </small>
                        <small className="text-muted d-block">
                          👥 Visiteurs/jour: {habitat.visiteurs_par_jour}
                        </small>
                        {habitat.animaux && (
                          <Badge bg="info" className="mt-1">
                            {habitat.animaux.length} animaux
                          </Badge>
                        )}
                      </div>

                      <div className="d-flex gap-2 mt-auto">
                        <Button
                          size="sm"
                          variant="outline-warning"
                          onClick={() => openEditModal(habitat)}
                          className="flex-grow-1"
                        >
                          ✏️ Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => openDeleteConfirm(habitat)}
                          disabled={habitat.animaux?.length > 0}
                          title={
                            habitat.animaux?.length > 0
                              ? 'Impossible de supprimer: animaux présents'
                              : 'Supprimer cet habitat'
                          }
                        >
                          🗑️
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL CRÉATION HABITAT */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>➕ Créer un habitat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateHabitat}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom de l'habitat :</Form.Label>
                  <Form.Control
                    type="text"
                    name="nom"
                    placeholder="Ex: Savane Africaine"
                    value={createForm.nom}
                    onChange={handleCreateFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Superficie :</Form.Label>
                  <Form.Control
                    type="text"
                    name="superficie"
                    placeholder="Ex: 5000 m²"
                    value={createForm.superficie}
                    onChange={handleCreateFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Température :</Form.Label>
                  <Form.Control
                    type="text"
                    name="temperature"
                    placeholder="Ex: 20-35°C"
                    value={createForm.temperature}
                    onChange={handleCreateFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Visiteurs par jour :</Form.Label>
                  <Form.Control
                    type="number"
                    name="visiteurs_par_jour"
                    placeholder="Ex: 150"
                    value={createForm.visiteurs_par_jour}
                    onChange={handleCreateFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description :</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Description complète de l'habitat..."
                value={createForm.description}
                onChange={handleCreateFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de l'image (optionnel) :</Form.Label>
              <Form.Control
                type="url"
                name="image_url"
                placeholder="https://example.com/image.jpg"
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
          <Button variant="success" onClick={handleCreateHabitat}>
            ➕ Créer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL ÉDITION HABITAT */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>✏️ Modifier l'habitat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditHabitat}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom de l'habitat :</Form.Label>
                  <Form.Control
                    type="text"
                    name="nom"
                    value={editForm.nom}
                    onChange={handleEditFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Superficie :</Form.Label>
                  <Form.Control
                    type="text"
                    name="superficie"
                    value={editForm.superficie}
                    onChange={handleEditFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Température :</Form.Label>
                  <Form.Control
                    type="text"
                    name="temperature"
                    value={editForm.temperature}
                    onChange={handleEditFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Visiteurs par jour :</Form.Label>
                  <Form.Control
                    type="number"
                    name="visiteurs_par_jour"
                    value={editForm.visiteurs_par_jour}
                    onChange={handleEditFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description :</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editForm.description}
                onChange={handleEditFormChange}
                required
              />
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
          <div className="d-flex justify-content-between align-items-center w-100">
            {/* BOUTON SUPPRIMER À GAUCHE */}
            <Button
              variant="danger"
              onClick={() => {
                setShowEditModal(false);
                openDeleteConfirm(selectedHabitat);
              }}
              disabled={selectedHabitat?.animaux?.length > 0}
              title={
                selectedHabitat?.animaux?.length > 0
                  ? 'Impossible de supprimer: animaux présents'
                  : 'Supprimer cet habitat'
              }
            >
              🗑️ Supprimer
            </Button>

            {/* BOUTONS ACTION À DROITE */}
            <div className="d-flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Annuler
              </Button>
              <Button variant="warning" onClick={handleEditHabitat}>
                ✏️ Modifier
              </Button>
            </div>
          </div>
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
            Vous êtes sur le point de supprimer l'habitat{' '}
            <strong>"{confirmDelete?.nom}"</strong>.
            <br />
            <br />
            {confirmDelete?.animaux?.length > 0 ? (
              <div>
                <strong>❌ Suppression impossible :</strong> Cet habitat
                contient {confirmDelete.animaux.length} animal(x). Déplacez
                d'abord les animaux vers d'autres habitats.
              </div>
            ) : (
              <div>
                Cette action est <strong>irréversible</strong>.
              </div>
            )}
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
            Annuler
          </Button>
          {(!confirmDelete?.animaux || confirmDelete.animaux.length === 0) && (
            <Button
              variant="danger"
              onClick={() => handleDeleteHabitat(confirmDelete.id)}
            >
              🗑️ Supprimer définitivement
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GestionHabitats;
