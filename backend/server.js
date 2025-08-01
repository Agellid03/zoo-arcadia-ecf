const express = require('express');
const connectMongoDB = require('./config/mongodb');
const cors = require('cors');
const AnimalStats = require('./models/AnimalStats');
require('dotenv').config();
const {
  sequelize,
  Habitat,
  Animal,
  User,
  Service,
  Avis,
  RapportVeterinaire,
  ConsommationNourriture,
  CommentaireHabitat,
} = require('./models/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ==========================================
// MIDDLEWARE D'AUTHENTIFICATION
// ==========================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // 1. Récupérer le token dans l'en-tête Authorization
  const token = authHeader && authHeader.split(' ')[1];
  // 2. Vérifier si token existe
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  // 3. Vérifier si token est valide
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    // 4. Ajouter les infos user à la requête
    req.user = user;
    next();
  });
};

// ==========================================
// CONFIGURATION EXPRESS
// ==========================================

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// ROUTE DE TEST
// ==========================================

app.get('/', (req, res) => {
  res.json({
    message: 'API Zoo Arcadia fonctionne !',
    développeur: 'Verso',
    projet: 'ECF développeur web',
  });
});

// ==========================================
// ROUTES AUTHENTIFICATION (US9)
// ==========================================

// Connexion utilisateur
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Email introuvable' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
    );

    res.json({
      message: 'Connexion réussie',
      token: token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route de test protection
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'Accès autorisé !',
    user: req.user,
  });
});

// ==========================================
// ROUTES GESTION UTILISATEURS (US6 - Admin)
// ==========================================

// Créer utilisateur (Admin)
app.post('/api/users', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.create({
      email: email,
      password: password,
      role: role,
    });

    res.json({
      message: 'Utilisateur créé',
      user: user,
    });
  } catch (error) {
    console.error('Erreur', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Lister tous les utilisateurs (Admin)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Accès réservé aux administrateurs' });
    }

    const users = await User.findAll({
      attributes: ['id', 'email', 'role', 'createdAt'], // Exclure password
      order: [['createdAt', 'DESC']],
    });

    res.json({
      message: 'Liste des utilisateurs',
      users: users,
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Modifier utilisateur (Admin)
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Accès réservé aux administrateurs' });
    }

    const userId = parseInt(req.params.id);
    const { email, role, password } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    // Préparer les données à mettre à jour
    const updateData = {};
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) updateData.password = password; // Sera hashé par le hook beforeUpdate

    await user.update(updateData);

    res.json({
      message: 'Utilisateur mis à jour avec succès',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer utilisateur (Admin)
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Accès réservé aux administrateurs' });
    }

    const userId = parseInt(req.params.id);

    // Vérifier que l'admin ne se supprime pas lui-même
    if (userId === req.user.userId) {
      return res
        .status(400)
        .json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    await user.destroy();

    res.json({
      message: 'Utilisateur supprimé avec succès',
      deleted_user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==========================================
// ROUTES HABITATS (US4)
// ==========================================

// Lister tous les habitats (Public)
app.get('/api/habitats', async (req, res) => {
  try {
    const habitats = await Habitat.findAll({
      include: 'animaux',
    });
    res.json(habitats);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Détail habitat avec animaux (Public)
app.get('/api/habitats/:id', async (req, res) => {
  try {
    const habitatId = parseInt(req.params.id);

    const habitat = await Habitat.findOne({
      where: { id: habitatId },
      include: [
        {
          model: Animal,
          as: 'animaux',
        },
      ],
    });

    if (!habitat) {
      return res.status(404).json({ error: 'Habitat introuvable' });
    }

    res.json(habitat);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer habitat (Admin)
app.post('/api/habitats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès admin requis' });
    }

    const habitat = await Habitat.create(req.body);
    res.json({ message: 'Habitat créé', habitat });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Modifier habitat (Admin)
app.put('/api/habitats/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès admin requis' });
    }

    await Habitat.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Habitat mis à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer habitat (Admin)
app.delete('/api/habitats/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès admin requis' });
    }

    const habitatId = parseInt(req.params.id);
    const habitat = await Habitat.findByPk(habitatId);
    if (!habitat) {
      return res.status(404).json({ error: 'Habitat introuvable' });
    }

    await habitat.destroy();

    res.json({ message: 'Habitat supprimé avec succès' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Lister commentaires habitats (Admin/Vétérinaire)
app.get(
  '/api/habitats/:id/commentaires',
  authenticateToken,
  async (req, res) => {
    try {
      if (req.user.role !== 'admin' && req.user.role !== 'veterinaire') {
        return res
          .status(403)
          .json({ error: 'Accès réservé aux administrateurs et vétérinaires' });
      }

      const habitatId = parseInt(req.params.id);

      const commentaires = await CommentaireHabitat.findAll({
        where: { habitat_id: habitatId },
        include: [
          { model: Habitat, as: 'habitat' },
          { model: User, as: 'veterinaire', attributes: ['email'] },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.json(commentaires);
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },
);

// Ajouter commentaire vétérinaire sur habitat (US8)
app.post(
  '/api/habitats/:id/commentaires',
  authenticateToken,
  async (req, res) => {
    try {
      // Vérifier que c'est un vétérinaire
      if (req.user.role !== 'veterinaire') {
        return res
          .status(403)
          .json({ error: 'Accès réservé aux vétérinaires' });
      }

      const habitatId = parseInt(req.params.id);
      const { commentaire, statut_habitat } = req.body;

      // Vérifier que l'habitat existe
      const habitat = await Habitat.findByPk(habitatId);
      if (!habitat) {
        return res.status(404).json({ error: 'Habitat introuvable' });
      }

      // Créer le commentaire
      const nouveauCommentaire = await CommentaireHabitat.create({
        habitat_id: habitatId,
        veterinaire_id: req.user.userId,
        commentaire: commentaire,
        statut_habitat: statut_habitat,
      });

      res.json({
        message: 'Commentaire ajouté avec succès',
        commentaire: nouveauCommentaire,
      });
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },
);

// ==========================================
// ROUTES ANIMAUX (US4)
// ==========================================

// Détail animal + dernier rapport (Public)
app.get('/api/animaux/:id', async (req, res) => {
  try {
    const animalId = req.params.id;

    const animal = await Animal.findOne({
      where: { id: animalId },
      include: [
        { model: Habitat, as: 'habitat' },
        {
          model: RapportVeterinaire,
          as: 'rapports',
          limit: 1,
          order: [['date_passage', 'DESC']],
        },
      ],
    });

    if (!animal) {
      return res.status(404).json({ error: 'Animal introuvable' });
    }

    res.json(animal);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Incrémenter consultation animal - Compteur MongoDB (US11)
app.post('/api/animaux/:id/view', async (req, res) => {
  try {
    const animalId = parseInt(req.params.id);

    // Récupérer l'animal pour avoir son nom
    const animal = await Animal.findByPk(animalId);
    if (!animal) {
      return res.status(404).json({ error: 'Animal introuvable' });
    }

    // Incrémenter ou créer statistique MongoDB
    await AnimalStats.findOneAndUpdate(
      { animal_id: animalId },
      {
        animal_name: animal.prenom,
        $inc: { views: 1 },
        last_viewed: new Date(),
      },
      {
        upsert: true,
        new: true,
      },
    );

    res.json({
      message: 'Consultation enregistrée',
      animal: animal.prenom,
    });
  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer animal (Admin)
app.post('/api/animaux', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Accès réservé aux administrateurs' });
    }

    const { prenom, race, habitat_id, image_url } = req.body;

    const animal = await Animal.create({
      prenom: prenom,
      race: race,
      habitat_id: habitat_id,
      image_url: image_url,
    });

    res.json({
      message: 'Animal créé avec succès',
      animal: animal,
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Modifier animal (Admin)
app.put('/api/animaux/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès admin requis' });
    }

    await Animal.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Animal mis à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer animal (Admin)
app.delete('/api/animaux/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès admin requis' });
    }

    const animalId = parseInt(req.params.id);
    const animal = await Animal.findByPk(animalId);
    if (!animal) {
      return res.status(404).json({ error: 'Animal introuvable' });
    }

    await animal.destroy();
    res.json({ message: 'Animal supprimé avec succès' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==========================================
// ROUTES SERVICES (US3)
// ==========================================

// Lister services (Public)
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer service (Admin/Employé)
app.post('/api/services', authenticateToken, async (req, res) => {
  try {
    const { nom, description } = req.body;

    const service = await Service.create({
      nom: nom,
      description: description,
    });

    res.json({
      message: 'Service créé',
      service: service,
    });
  } catch (error) {
    console.error('Erreur', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Modifier service (Admin)
app.put('/api/services/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Accès réservé aux administrateurs' });
    }

    const serviceId = parseInt(req.params.id);
    const { nom, description } = req.body;

    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service introuvable' });
    }

    await service.update({
      nom: nom || service.nom,
      description: description || service.description,
    });

    res.json({
      message: 'Service mis à jour avec succès',
      service: service,
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer service (Admin)
app.delete('/api/services/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès admin requis' });
    }

    const serviceId = parseInt(req.params.id);
    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service introuvable' });
    }

    await service.destroy();
    res.json({ message: 'Service supprimé avec succès' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==========================================
// ROUTES AVIS (US5) - ORDRE CORRIGÉ
// ==========================================

// Lister tous les avis (Admin/Employé) - ROUTE SPÉCIFIQUE EN PREMIER
app.get('/api/avis/all', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'employe') {
      return res
        .status(403)
        .json({ error: 'Accès réservé aux administrateurs et employés' });
    }

    const avis = await Avis.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'employe',
          attributes: ['email'],
          required: false,
        },
      ],
    });

    res.json(avis);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Lister avis approuvés (Public) - ROUTE GÉNÉRALE APRÈS
app.get('/api/avis', async (req, res) => {
  try {
    const avis = await Avis.findAll({ where: { statut: 'approuve' } });
    res.json(avis);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer avis (Visiteur)
app.post('/api/avis', async (req, res) => {
  try {
    const { pseudo, texte } = req.body;

    if (!pseudo || !texte) {
      return res.status(400).json({ error: 'Pseudo et texte obligatoires' });
    }

    const avis = await Avis.create({
      pseudo: pseudo,
      texte: texte,
      statut: 'en_attente',
    });

    res.json({
      message: 'Merci pour votre avis ! Il sera examiné par notre équipe.',
    });
  } catch (error) {
    console.error('Erreur', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Valider avis (Employé)
app.put('/api/avis/:id', authenticateToken, async (req, res) => {
  try {
    const avisId = req.params.id;
    const { statut } = req.body;

    const avis = await Avis.findOne({
      where: { id: avisId },
    });

    if (!avis) {
      return res.status(404).json({ error: 'Avis introuvable' });
    }

    await avis.update({
      statut: statut,
      employe_id: req.user.userId,
    });

    res.json({ message: 'Avis mis à jour' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==========================================
// ROUTES RAPPORTS VÉTÉRINAIRES (US8)
// ==========================================

// Lister tous les rapports (Admin)
app.get('/api/rapports', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Accès réservé aux administrateurs' });
    }

    const rapports = await RapportVeterinaire.findAll({
      include: [
        { model: Animal, as: 'animal' },
        { model: User, as: 'veterinaire' },
      ],
      order: [['date_passage', 'DESC']],
    });

    res.json(rapports);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer rapport (Vétérinaire)
app.post('/api/rapports', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'veterinaire') {
      return res.status(403).json({ error: 'Accès réservé aux vétérinaires' });
    }

    const {
      animal_id,
      etat_animal,
      nourriture_proposee,
      grammage_nourriture,
      date_passage,
      detail_etat,
    } = req.body;

    const rapport = await RapportVeterinaire.create({
      animal_id: animal_id,
      etat_animal: etat_animal,
      nourriture_proposee: nourriture_proposee,
      grammage_nourriture: grammage_nourriture,
      date_passage: date_passage,
      detail_etat: detail_etat,
      veterinaire_id: req.user.userId,
    });

    res.json({
      message: 'Rapport vétérinaire créé',
      rapport: rapport,
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==========================================
// ROUTES CONSOMMATION NOURRITURE (US7/US8)
// ==========================================

// Lister consommations (Vétérinaire)
app.get('/api/consommations', authenticateToken, async (req, res) => {
  try {
    const consommations = await ConsommationNourriture.findAll({
      include: [
        { model: Animal, as: 'animal' },
        { model: User, as: 'employe' },
      ],
      order: [['date_consommation', 'DESC']],
    });

    res.json(consommations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Enregistrer consommation (Employé)
app.post('/api/consommations', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'employe') {
      return res.status(403).json({ error: 'Accès réservé aux employés' });
    }

    const {
      animal_id,
      date_consommation,
      heure_consommation,
      nourriture_donnee,
      quantite,
    } = req.body;

    const consommation = await ConsommationNourriture.create({
      animal_id,
      employe_id: req.user.userId,
      date_consommation,
      heure_consommation,
      nourriture_donnee,
      quantite,
    });

    res.json({
      message: 'Consommation enregistrée',
      consommation,
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==========================================
// ROUTE DASHBOARD ADMIN (US6/US11)
// ==========================================

// Statistiques consultation animaux (Admin)
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    // Vérifier que c'est un admin
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Accès réservé aux administrateurs' });
    }

    // Récupérer toutes les statistiques triées par popularité
    const stats = await AnimalStats.find({})
      .sort({ views: -1 }) // Tri décroissant (plus populaire en premier)
      .limit(20); // Top 20 pour éviter surcharge

    // Calculer statistiques globales
    const totalViews = await AnimalStats.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } },
    ]);

    res.json({
      animals_stats: stats,
      total_consultations: totalViews[0]?.total || 0,
      most_popular: stats[0]?.animal_name || 'Aucune consultation',
      stats_count: stats.length,
    });
  } catch (error) {
    console.error('Erreur dashboard:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==========================================
// ROUTE CONTACT (US10)
// ==========================================

app.post('/api/contact', async (req, res) => {
  try {
    const { titre, description, email } = req.body;

    // Simulation envoi email pour l'ECF
    console.log('📧 Contact reçu:', { titre, description, email });

    res.json({
      message: 'Votre message a été envoyé. Nous vous répondrons rapidement.',
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==========================================
// DÉMARRAGE SERVEUR
// ==========================================

sequelize.sync().then(() => {
  connectMongoDB();
  app.listen(PORT, () => {
    console.log(`🦁 Serveur Zoo Arcadia sur le port ${PORT}`);
    console.log(`📡 Teste API sur : http://localhost:${PORT}`);
  });
});
