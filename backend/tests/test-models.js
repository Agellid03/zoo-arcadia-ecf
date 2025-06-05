const { sequelize, Habitat, Animal } = require('./models/index');

const testModels = async () => {
  try {
    // 1. Synchroniser
    console.log('🔄 Synchronisation...');
    await sequelize.sync();

    // 2. Créer habitat
    const savane = await Habitat.create({
      nom: 'Savane Test',
      description: 'Habitat de test',
      superficie: '10 hectares',
      temperature: '25-30°C',
      visiteurs_par_jour: 150,
    });

    // 3. Créer animal
    const simba = await Animal.create({
      prenom: 'Simba Test',
      race: 'Lion',
      habitat_id: savane.id,
    });

    // 4. Test des relations maintenant
    console.log('🔗 Test des relations...');

    // Récupérer habitat avec ses animaux
    const habitatAvecAnimaux = await Habitat.findOne({
      include: 'animaux',
    });

    // Récupérer animal avec son habitat
    const animalAvecHabitat = await Animal.findOne({
      include: 'habitat',
    });

    console.log('✅ Habitat:', habitatAvecAnimaux.nom);
    console.log('🦁 Ses animaux:', habitatAvecAnimaux.animaux);
    console.log('🦁 Animal:', animalAvecHabitat.prenom);
    console.log('🏞️ Son habitat:', animalAvecHabitat.habitat.nom);
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
};

testModels();
