const fetch = require('node-fetch');

const testCommentaireHabitat = async () => {
  try {
    console.log('🏥 Test commentaire vétérinaire habitat...');

    // 1. Login vétérinaire pour récupérer token
    const loginResponse = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'veterinaire@zoo.fr',
        password: 'veto123',
      }),
    });

    const { token } = await loginResponse.json();
    console.log('✅ Token vétérinaire récupéré');

    // 2. Ajouter commentaire sur habitat 1 (Savane)
    const commentResponse = await fetch(
      'http://localhost:5000/api/habitats/1/commentaires',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          commentaire:
            'Habitat Savane en excellent état. Animaux en bonne santé, enclos propre et sécurisé.',
          statut_habitat: 'bon',
        }),
      },
    );

    const result = await commentResponse.json();
    console.log('🏞️ Résultat commentaire:', result);
  } catch (error) {
    console.error('❌ Erreur test:', error);
  }
};

testCommentaireHabitat();
