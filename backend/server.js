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
  const habitats = [
    {
      id: 1,
      nom: 'Savane',
      description: 'Vaste plaine africaine où règnent les rois de la jungle',
      animaux: ['Lions', 'Éléphants', 'Zèbres', 'Girafes'],
      superficie: '15 hectares',
      temperature: '25-35°C',
      visiteurs_par_jour: 200,
    },
    {
      id: 2,
      nom: 'Jungle',
      description: 'Forêt tropicale luxuriante pleine de mystères',
      animaux: ['Singes', 'Perroquets', 'Paresseux'],
      superficie: '8 hectares',
      temperature: '28-35°C',
      visiteurs_par_jour: 150,
    },
    {
      id: 3,
      nom: 'Marais',
      description:
        'Zones humides et mysterieuse, pas très attirantes mais fascinantes',
      animaux: ['Crocodiles', 'Hérons', 'Tortues'],
      superficie: '5 hectares',
      temperature: '20-28°C',
      visiteurs_par_jour: 50,
    },
  ];

  res.json(habitats);
});

//Démmarage du serveur
app.listen(PORT, () => {
  console.log(`Serveur Zoo Arcadia sur le port ${PORT}`);
  console.log(`Teste API sur : http://localhost:${PORT}`);
});
