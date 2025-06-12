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
 * COMPOSANT GESTION SERVICES (US6 - Admin)
 *
 * FONCTIONNALITÉS :
 * - CRUD complet services du zoo
 * - Création nouveaux services
 * - Modification services existants
 * - Suppression services
 * - Interface simple et efficace
 */
const GestionServices = ({ show, onHide }) => {
  // États des données
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // États modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // États formulaires
  const [createForm, setCreateForm] = useState({
    nom: '',
    description: '',
  });

  const [editForm, setEditForm] = useState({
    nom: '',
    description: '',
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
    });
  };

  // ==========================================
  // OPÉRATIONS CRUD
  // ==========================================

  // Charger tous les services
  const fetchServices = async () => {
    try {
      setLoading(true);
      resetMessages();

      console.log('🎯 Chargement services...');

      const response = await axios.get(`${API_BASE_URL}/services`);

      setServices(response.data);
      console.log('✅ Services chargés:', response.data);
    } catch (error) {
      console.error('❌ Erreur chargement services:', error);
      setError('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  // Créer service
  const handleCreateService = async (e) => {
    e.preventDefault();

    try {
      resetMessages();
      console.log('➕ Création service:', createForm.nom);

      await axios.post(`${API_BASE_URL}/services`, createForm, {
        headers: apiHeaders,
      });

      // Succès
      showSuccessMessage(`Service "${createForm.nom}" créé avec succès !`);
      setShowCreateModal(false);
      resetCreateForm();
      fetchServices(); // Rafraîchir la liste
    } catch (error) {
      console.error('❌ Erreur création service:', error);
      setError(error.response?.data?.error || 'Erreur lors de la création');
    }
  };

  // Modifier service
  const handleEditService = async (e) => {
    e.preventDefault();

    try {
      resetMessages();
      console.log('✏️ Modification service ID:', selectedService.id);

      await axios.put(
        `${API_BASE_URL}/services/${selectedService.id}`,
        editForm,
        {
          headers: apiHeaders,
        },
      );

      // Succès
      showSuccessMessage(`Service "${editForm.nom}" modifié avec succès !`);
      setShowEditModal(false);
      setSelectedService(null);
      fetchServices(); // Rafraîchir la liste
    } catch (error) {
      console.error('❌ Erreur modification service:', error);
      setError(error.response?.data?.error || 'Erreur lors de la modification');
    }
  };

  // Supprimer service
  const handleDeleteService = async (serviceId) => {
    try {
      resetMessages();
      console.log('🗑️ Suppression service ID:', serviceId);

      await axios.delete(`${API_BASE_URL}/services/${serviceId}`, {
        headers: apiHeaders,
      });

      // Succès
      showSuccessMessage('Service supprimé avec succès !');
      setConfirmDelete(null);
      fetchServices(); // Rafraîchir la liste
    } catch (error) {
      console.error('❌ Erreur suppression service:', error);
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
  const openEditModal = (service) => {
    setSelectedService(service);
    setEditForm({
      nom: service.nom,
      description: service.description,
    });
    setShowEditModal(true);
  };

  // Confirmer suppression
  const openDeleteConfirm = (service) => {
    setConfirmDelete(service);
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
      fetchServices();
    }
  }, [show]);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <>
      {/* MODAL PRINCIPAL GESTION SERVICES */}
      <Modal show={show} onHide={onHide} size="xl" backdrop="static">
        <Modal.Header closeButton className="bg-secondary text-white">
          <Modal.Title>🎯 Gestion des Services</Modal.Title>
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

          {/* BOUTON CRÉER SERVICE */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Services du zoo ({services.length})</h5>
            <Button variant="secondary" onClick={openCreateModal}>
              ➕ Créer service
            </Button>
          </div>

          {/* TABLEAU SERVICES */}
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="secondary" />
              <p className="mt-2">Chargement des services...</p>
            </div>
          ) : (
            <>
              {/* VERSION GRILLE POUR PLUS DE VISIBILITÉ */}
              <Row>
                {services.map((service) => (
                  <Col md={6} lg={4} key={service.id} className="mb-4">
                    <Card className="h-100 shadow-sm border-0">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="text-secondary h6">
                          🎯 {service.nom}
                        </Card.Title>

                        <Card.Text className="flex-grow-1 small">
                          {service.description.length > 120
                            ? `${service.description.substring(0, 120)}...`
                            : service.description}
                        </Card.Text>

                        <div className="d-flex gap-2 mt-auto">
                          <Button
                            size="sm"
                            variant="outline-warning"
                            onClick={() => openEditModal(service)}
                            className="flex-grow-1"
                          >
                            ✏️ Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => openDeleteConfirm(service)}
                          >
                            🗑️
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* MESSAGE SI AUCUN SERVICE */}
              {services.length === 0 && (
                <Alert variant="info" className="text-center">
                  Aucun service créé pour le moment.
                  <br />
                  <Button
                    variant="outline-info"
                    onClick={openCreateModal}
                    className="mt-2"
                  >
                    ➕ Créer le premier service
                  </Button>
                </Alert>
              )}
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL CRÉATION SERVICE */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>➕ Créer un service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateService}>
            <Form.Group className="mb-3">
              <Form.Label>Nom du service :</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                placeholder="Ex: Restauration, Visite guidée..."
                value={createForm.nom}
                onChange={handleCreateFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description :</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                placeholder="Décrivez ce service en détail..."
                value={createForm.description}
                onChange={handleCreateFormChange}
                required
              />
              <Form.Text className="text-muted">
                {createForm.description.length}/500 caractères recommandés
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Annuler
          </Button>
          <Button variant="success" onClick={handleCreateService}>
            ➕ Créer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL ÉDITION SERVICE */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>✏️ Modifier le service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditService}>
            <Form.Group className="mb-3">
              <Form.Label>Nom du service :</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={editForm.nom}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description :</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={editForm.description}
                onChange={handleEditFormChange}
                required
              />
              <Form.Text className="text-muted">
                {editForm.description.length}/500 caractères recommandés
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Annuler
          </Button>
          <Button variant="warning" onClick={handleEditService}>
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
            Vous êtes sur le point de supprimer le service{' '}
            <strong>"{confirmDelete?.nom}"</strong>.
            <br />
            <br />
            Cette action est <strong>irréversible</strong>.
            <br />
            Le service ne sera plus visible par les visiteurs du site.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteService(confirmDelete.id)}
          >
            🗑️ Supprimer définitivement
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GestionServices;
