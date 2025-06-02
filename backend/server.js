const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize, Habitat, Animal } = require('./models/index');

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

// Synchroniser la base avant de démarrer le serveur
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(` Serveur Zoo Arcadia sur le port ${PORT}`);
    console.log(` Teste API sur : http://localhost:${PORT}`);
  });
});
