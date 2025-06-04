const fetch = require('node-fetch');

const testUserCreation = async () => {
  try {
    console.log('🧪 Test création utilisateur...');

    const response = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'employe1@zoo.fr',
        password: 'motdepasse123',
        role: 'employe',
      }),
    });

    const result = await response.json();
    console.log('✅ Résultat:', result);
  } catch (error) {
    console.error('❌ Erreur test:', error);
  }
};

testUserCreation();
