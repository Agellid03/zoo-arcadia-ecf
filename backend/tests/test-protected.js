const fetch = require('node-fetch');

const testProtectedRoute = async () => {
  try {
    console.log(' Test route protégée SANS token...');

    // Test SANS token - doit échouer
    const response = await fetch('http://localhost:5000/api/protected');
    const result = await response.json();

    console.log(' Résultat:', result);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

testProtectedRoute();

const testWithToken = async () => {
  try {
    console.log('\n🔐 Test route protégée AVEC token...');

    // Utilise le token de ton test login précédent
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0ODk2OTc1MCwiZXhwIjoxNzQ5MDU2MTUwfQ.G9D5R7pz8ynbpP8bsw9o4Vc36vJLQB1hIwptQ_-nBOE';

    const response = await fetch('http://localhost:5000/api/protected', {
      headers: {
        Authorization: `Bearer ${token}`, // ← Format Bearer + token
      },
    });

    const result = await response.json();
    console.log('✅ Résultat (doit réussir):', result);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Lance les 2 tests
testProtectedRoute().then(() => testWithToken());
