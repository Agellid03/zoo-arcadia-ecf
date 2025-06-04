const fetch = require('node-fetch');

const testRapportVeterinaire = async () => {
  try {
    console.log('🩺 Test création rapport vétérinaire...');

    // Token d'un vétérinaire (il faut d'abord créer un user vétérinaire !)
    const token = 'TON_TOKEN_VETERINAIRE';

    const response = await fetch('http://localhost:5000/api/rapports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        animal_id: 1, // Animal existant
        etat_animal: 'En bonne santé',
        nourriture_proposee: 'Viande de bœuf',
        grammage_nourriture: 5000, // 5kg en grammes
        date_passage: '2025-06-03',
        detail_etat: 'Animal très actif, bon appétit',
      }),
    });

    const result = await response.json();
    console.log('✅ Résultat:', result);
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
};

testRapportVeterinaire();
