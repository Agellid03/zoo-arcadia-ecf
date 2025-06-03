const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize, Habitat, Animal, User } = require('./models/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//Création de l'app Express
const app = express();
const PORT = 5000;

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

//Roite pour créer un utilisateur

app.post('/api/users', async (req, res) => {
  try {
    // 1. Récuperer les données envoyées
    const { email, password, role } = req.body;

    //2. Créer l'utilisateur en base
    const user = await User.create({
      email: email,
      password: password, // A hacher plus tard
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

    // 6. Créer un token JWT (badge d'accès)
    const token = jwt.sign(
      { userId: user.id, role: user.role }, // ← Données dans le token
      'SECRET_KEY_TEMP', // Clé secrète (à améliorer)
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

// Synchroniser la base avant de démarrer le serveur
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(` Serveur Zoo Arcadia sur le port ${PORT}`);
    console.log(` Teste API sur : http://localhost:${PORT}`);
  });
});
