const {
  sequelize,
  Habitat,
  Animal,
  User,
  Service,
  Avis,
} = require('../models/index');

const testAllModels = async () => {
  try {
    console.log('🔄 Synchronisation tous les modèles...');
    await sequelize.sync({ force: true });

    console.log('✅ Toutes les tables créées !');
    console.log(
      '📊 Tables:',
      await sequelize.getQueryInterface().showAllTables(),
    );

    console.log('🎉 TEST RÉUSSI - Prêt à commit !');
  } catch (error) {
    console.error('❌ ERREUR:', error);
  }
};

testAllModels();
