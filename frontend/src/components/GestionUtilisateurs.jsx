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
} from 'react-bootstrap';
import axios from 'axios';

/**
 * COMPOSANT GESTION UTILISATEURS (US6 - Admin)
 *
 * FONCTIONNALITÉS :
 * - CRUD complet utilisateurs
 * - Création employé/vétérinaire
 * - Modification utilisateurs
 * - Suppression utilisateurs
 * - Interface modale réactive
 */
const GestionUtilisateurs = ({ show, onHide }) => {
  // États des données
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // États modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // États formulaires
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    role: 'employe',
  });

  const [editForm, setEditForm] = useState({
    email: '',
    role: '',
    password: '', // Optionnel
  });

  // Configuration API
  const API_BASE_URL = 'https://zoo-arcadia-ecf.onrender.com/api';
  const token = localStorage.getItem('zoo_token');

  const apiHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  //* FONCTIONS Utils

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const showSuccessMessage = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  //* OPÉRATIONS CRUD

  // Charger tous les utilisateurs
  const fetchUsers = async () => {
    try {
      setLoading(true);
      resetMessages();

      console.log('👥 Chargement utilisateurs...');

      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: apiHeaders,
      });

      setUsers(response.data.users);
      console.log('✅ Utilisateurs chargés:', response.data.users);
    } catch (error) {
      console.error('❌ Erreur chargement utilisateurs:', error);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  // Créer utilisateur
  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      resetMessages();
      console.log('➕ Création utilisateur:', createForm.email);

      await axios.post(`${API_BASE_URL}/users`, createForm, {
        headers: apiHeaders,
      });

      // Succès
      showSuccessMessage(`Utilisateur ${createForm.email} créé avec succès !`);
      setShowCreateModal(false);
      setCreateForm({ email: '', password: '', role: 'employe' });
      fetchUsers(); // Rafraîchir liste
    } catch (error) {
      console.error('❌ Erreur création utilisateur:', error);
      setError(error.response?.data?.error || 'Erreur lors de la création');
    }
  };

  // Modifier utilisateur
  const handleEditUser = async (e) => {
    e.preventDefault();

    try {
      resetMessages();
      console.log('✏️ Modification utilisateur ID:', selectedUser.id);

      // Préparer données = enlever champs vides
      const updateData = {};
      if (editForm.email) updateData.email = editForm.email;
      if (editForm.role) updateData.role = editForm.role;
      if (editForm.password) updateData.password = editForm.password;

      await axios.put(`${API_BASE_URL}/users/${selectedUser.id}`, updateData, {
        headers: apiHeaders,
      });

      // Succès
      showSuccessMessage(`Utilisateur modifié avec succès !`);
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('❌ Erreur modification utilisateur:', error);
      setError(error.response?.data?.error || 'Erreur lors de la modification');
    }
  };

  // Supprimer utilisateur
  const handleDeleteUser = async (userId) => {
    try {
      resetMessages();
      console.log('🗑️ Suppression utilisateur ID:', userId);

      await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: apiHeaders,
      });

      // Succès
      showSuccessMessage('Utilisateur supprimé avec succès !');
      setConfirmDelete(null);
      fetchUsers();
    } catch (error) {
      console.error('❌ Erreur suppression utilisateur:', error);
      setError(error.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  //* HANDLERS MODALS

  // Ouvrir modal création
  const openCreateModal = () => {
    setCreateForm({ email: '', password: '', role: 'employe' });
    setShowCreateModal(true);
  };

  // Ouvrir modal édition
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      email: user.email,
      role: user.role,
      password: '', // Laisser vide
    });
    setShowEditModal(true);
  };

  // Confirmer suppression
  const openDeleteConfirm = (user) => {
    setConfirmDelete(user);
  };

  useEffect(() => {
    if (show) {
      fetchUsers();
    }
  }, [show]);

  return (
    <>
      {/* MODAL PRINCIPAL GESTION UTILISATEURS */}
      <Modal show={show} onHide={onHide} size="xl" backdrop="static">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>👥 Gestion des Utilisateurs</Modal.Title>
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

          {/* BOUTON CRÉER UTILISATEUR */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Liste des utilisateurs ({users.length})</h5>
            <Button variant="success" onClick={openCreateModal}>
              ➕ Créer utilisateur
            </Button>
          </div>

          {/* TABLEAU UTILISATEURS */}
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Chargement des utilisateurs...</p>
            </div>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Créé le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.email}</strong>
                    </td>
                    <td>
                      <Badge
                        bg={
                          user.role === 'admin'
                            ? 'danger'
                            : user.role === 'veterinaire'
                            ? 'success'
                            : 'primary'
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      <small className="text-muted">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-warning"
                          onClick={() => openEditModal(user)}
                        >
                          ✏️ Modifier
                        </Button>
                        {user.role !== 'admin' && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => openDeleteConfirm(user)}
                          >
                            🗑️ Supprimer
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL CRÉATION UTILISATEUR */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>➕ Créer un utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateUser}>
            <Form.Group className="mb-3">
              <Form.Label>Email :</Form.Label>
              <Form.Control
                type="email"
                placeholder="utilisateur@zoo.fr"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mot de passe :</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mot de passe sécurisé"
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rôle :</Form.Label>
              <Form.Select
                value={createForm.role}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, role: e.target.value }))
                }
                required
              >
                <option value="employe">Employé</option>
                <option value="veterinaire">Vétérinaire</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Annuler
          </Button>
          <Button variant="success" onClick={handleCreateUser}>
            ➕ Créer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL ÉDITION UTILISATEUR */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>✏️ Modifier l'utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditUser}>
            <Form.Group className="mb-3">
              <Form.Label>Email :</Form.Label>
              <Form.Control
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rôle :</Form.Label>
              <Form.Select
                value={editForm.role}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, role: e.target.value }))
                }
                required
              >
                <option value="employe">Employé</option>
                <option value="veterinaire">Vétérinaire</option>
                <option value="admin">Administrateur</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nouveau mot de passe (optionnel) :</Form.Label>
              <Form.Control
                type="password"
                placeholder="Laisser vide pour conserver l'actuel"
                value={editForm.password}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Annuler
          </Button>
          <Button variant="warning" onClick={handleEditUser}>
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
            Vous êtes sur le point de supprimer l'utilisateur{' '}
            <strong>{confirmDelete?.email}</strong>.
            <br />
            <br />
            Cette action est <strong>irréversible</strong>.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteUser(confirmDelete.id)}
          >
            🗑️ Supprimer définitivement
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GestionUtilisateurs;
