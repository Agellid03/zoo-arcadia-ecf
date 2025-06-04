const fetch = require('node-fetch');

const testAnimalCreation = async () => {
  try {
    console.log('🦁 Test création animal...');
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0OTA1Mzg2MCwiZXhwIjoxNzQ5MTQwMjYwfQ.dl2yyZeS9_TSJLrWXKvXF-Jdn22PcAsOTf8CEf8mBqM';

    const response = await fetch('http://localhost:5000/api/animaux', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        prenom: 'Simba',
        race: 'Lion',
        habitat_id: 1,
        image_url: '/images/simba.jpg',
      }),
    });

    const result = await response.json();
    console.log('✅ Résultat:', result);
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
};

testAnimalCreation();
