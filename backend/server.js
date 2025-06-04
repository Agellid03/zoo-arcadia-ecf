const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {
  sequelize,
  Habitat,
  Animal,
  User,
  Service,
  Avis,
  RapportVeterinaire,
} = require('./models/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  // 1. Récupérer le token dans l'en-tête Authorization
  const authHeader = req.headers['authorization'];
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
    req.user = user; // userId et role disponibles partout !
    next();
  });
};

//Création de l'app Express
const app = express();
const PORT = process.env.PORT || 5000;

//Middlewares
app.use(cors());
app.use(express.json());

//Route de test - première API !
app.get('/', (req, res) => {
  res.json({
    message: 'API Zoo Arcadia fonctionne !',
    développeur: 'Verso',
    projet: 'ECF développeur web',
  });
});

//Route pour récupérer les habitats
app.get('/api/habitats', async (req, res) => {
  try {
    // Récupérer tous les habitats avec leurs animaux
    const habitats = await Habitat.findAll({
      include: 'animaux',
    });

    res.json(habitats);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour créer un animal
app.post('/api/animaux', authenticateToken, async (req, res) => {
  try {
    // 1. Vérifier que c'est un admin
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Accès réservé aux administrateurs' });
    }

    // 2. Récupérer les données
    const { prenom, race, habitat_id, image_url } = req.body;

    // 3. Créer l'animal
    const animal = await Animal.create({
      prenom: prenom,
      race: race,
      habitat_id: habitat_id,
      image_url: image_url,
    });

    // 4. Répondre
    res.json({
      message: 'Animal créé avec succès',
      animal: animal,
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

//Route pour créer un utilisateur
app.post('/api/users', async (req, res) => {
  try {
    // 1. Récupérer les données envoyées
    const { email, password, role } = req.body;

    //2. Créer l'utilisateur en base
    const user = await User.create({
      email: email,
      password: password,
      role: role,
    });

    //3. Répondre au client
    res.json({
      message: 'Utilisateur créé',
      user: user,
    });
  } catch (error) {
    console.error('Erreur', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route de connexion
app.post('/api/login', async (req, res) => {
  try {
    // 1. Récupérer email et password envoyés
    const { email, password } = req.body;

    // 2. Chercher l'utilisateur en base
    const user = await User.findOne({ where: { email } });

    // 3. Vérifier si user existe
    if (!user) {
      return res.status(401).json({ error: 'Email introuvable' });
    }

    // 4. Comparer le mot de passe (hashé vs envoyé)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // 5. Si mot de passe incorrect
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    // 6. Créer un token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role }, //  Données dans le token
      process.env.JWT_SECRET, //  Clé secrète sécurisée
      { expiresIn: '24h' }, //  Durée de validité
    );

    // 7. Répondre avec succès
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

//Route pour récupérer les services
app.get('/api/services', async (req, res) => {
  try {
    // Récupérer tous les services
    const services = await Service.findAll();

    res.json(services);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

//Route pour créer un service
app.post('/api/services', authenticateToken, async (req, res) => {
  try {
    //1. Récupérer les données envoyées
    const { nom, description } = req.body;

    //2. Créer l'utilisateur en base
    const service = await Service.create({
      nom: nom,
      description: description,
    });

    //3. Répondre au client
    res.json({
      message: 'Service créé',
    });
  } catch (error) {
    console.error('Erreur', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route protégée pour test
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'Accès autorisé !',
    user: req.user,
  });
});

// Route pour récupérer les avis (approuvé)
app.get('/api/avis', async (req, res) => {
  try {
    const avis = await Avis.findAll({ where: { statut: 'approuve' } });
    res.json(avis);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour créé un avis
app.post('/api/avis', async (req, res) => {
  try {
    //Récupérer les données envoyées
    const { pseudo, texte } = req.body;

    // Si pas de pseudo ou texte = erreur
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

// Route pour modifier un avis
app.put('/api/avis/:id', authenticateToken, async (req, res) => {
  try {
    // 1. Récupérer l'ID de l'avis à modifier
    const avisId = req.params.id;

    // 2. Récupérer le nouveau statut envoyé
    const { statut } = req.body;

    // 3. Trouver et modifier l'avis
    const avis = await Avis.findOne({
      where: { id: avisId },
    });

    // 4. Vérifier si avis existe
    if (!avis) {
      return res.status(404).json({ error: 'Avis introuvable' });
    }

    // 5. Mettre à jour avec nouveau statut + employé
    await avis.update({
      statut: statut,
      employe_id: req.user.userId,
    });

    // 6. Répondre
    res.json({ message: 'Avis mis à jour' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour créer un rapport vétérinaire
app.post('/api/rapports', authenticateToken, async (req, res) => {
  try {
    // 1. Vérifier que c'est un vétérinaire
    if (req.user.role !== 'veterinaire') {
      return res.status(403).json({ error: 'Accès réservé aux vétérinaires' });
    }

    // 2. Récupérer les données
    const {
      animal_id,
      etat_animal,
      nourriture_proposee,
      grammage_nourriture,
      date_passage,
      detail_etat,
    } = req.body;

    // 3. Créer le rapport
    const rapport = await RapportVeterinaire.create({
      animal_id: animal_id,
      etat_animal: etat_animal,
      nourriture_proposee: nourriture_proposee,
      grammage_nourriture: grammage_nourriture,
      date_passage: date_passage,
      detail_etat: detail_etat,
      veterinaire_id: req.user.userId,
    });

    // 4. Répondre
    res.json({
      message: 'Rapport vétérinaire créé',
      rapport: rapport,
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Synchroniser la base avant de démarrer le serveur
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(` Serveur Zoo Arcadia sur le port ${PORT}`);
    console.log(` Teste API sur : http://localhost:${PORT}`);
  });
});
