const { sequelize } = require('../models/index');

const cleanDatabase = async () => {
  try {
    console.log('🧹 Nettoyage de la base de données...');

    // Force la recréation complète de toutes les tables
    await sequelize.sync({ force: true });

    console.log('✅ Base de données nettoyée avec succès !');
    console.log('📊 Toutes les tables ont été supprimées et recréées.');
    console.log(
      '🔧 Structure des tables mise à jour avec les derniers modèles.',
    );

    // Fermer la connexion proprement
    await sequelize.close();
    console.log('🔌 Connexion fermée.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    process.exit(1);
  }
};

console.log('🚀 Démarrage du nettoyage...');
cleanDatabase();
