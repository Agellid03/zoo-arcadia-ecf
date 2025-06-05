const fetch = require('node-fetch');

const testDashboard = async () => {
  const response = await fetch('http://localhost:5000/api/dashboard/stats', {
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0OTEzOTg1MCwiZXhwIjoxNzQ5MjI2MjUwfQ.6VJyKkh1Z75Eei_RLScS8JcZpe8mHGDQ6lMVA5QQ-rU',
    },
  });

  const result = await response.json();
  console.log('📊 Dashboard:', result);
};

testDashboard();
