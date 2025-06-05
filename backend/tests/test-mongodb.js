const fetch = require('node-fetch');

const testMongoDB = async () => {
  try {
    console.log(' Test consultation MongoDB...');

    const response = await fetch('http://localhost:5000/api/animaux/1/view', {
      method: 'POST',
    });

    const result = await response.json();
    console.log(' Résultat:', result);
  } catch (error) {
    console.error(' Erreur:', error);
  }
};

testMongoDB();
