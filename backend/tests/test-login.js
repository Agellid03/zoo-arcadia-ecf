const fetch = require('node-fetch');

const testLogin = async () => {
  try {
    console.log('🔐 Test connexion...');

    const response = await fetch('http://localhost:5000/api/login', {
      // ← 5000 pas 500
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@zoo.fr',
        password: 'admin123',
      }),
    });

    const result = await response.json();
    console.log('✅ Résultat:', result);
  } catch (error) {
    console.error('❌ Erreur test:', error);
  }
};

testLogin();
