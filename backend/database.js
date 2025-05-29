const { Sequelize } = require('sequelize');

// Configuration SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './zoo_arcadia.db',
  logging: false,
});

// Test de connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite connecté !');
  } catch (error) {
    console.error('❌ Erreur SQLite:', error);
  }
};

testConnection();

module.exports = sequelize;
