const express = require('express');
const cors = require('cors');
require('dotenv').config();

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

//Route pour tester les habitats
app.get('/api/habitats', (req, res) => {
  res.json([
    { id: 1, nom: 'Savane', description: 'Lions et Eléphants' },
    { id: 2, nom: 'Jungle', description: 'Singes et Oiseaux' },
    { id: 3, nom: 'Marais', description: 'Crocodiles' },
  ]);
});

//Démmarage du serveur
app.listen(PORT, () => {
  console.log(`Serveur Zoo Arcadia sur le port ${PORT}`);
  console.log(`Teste API sur : http://localhost:${PORT}`);
});
