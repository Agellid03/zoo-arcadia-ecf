const {
  sequelize,
  User,
  Habitat,
  Animal,
  Service,
} = require('../models/index');

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding de la base de données...');

    // 1. LES UTILISATEURS
    console.log('👥 Création des utilisateurs...');

    const admin = await User.create({
      email: 'admin@zoo.fr',
      password: 'admin123',
      role: 'admin',
    });

    const employe = await User.create({
      email: 'employe@zoo.fr',
      password: 'employe123',
      role: 'employe',
    });

    const veterinaire = await User.create({
      email: 'veterinaire@zoo.fr',
      password: 'veto123',
      role: 'veterinaire',
    });

    // 2. CRÉER LES HABITATS
    console.log('🏞️ Création des habitats...');

    const savane = await Habitat.create({
      nom: 'Savane',
      description: 'Vaste plaine africaine où règnent les rois de la jungle',
      superficie: '15 hectares',
      temperature: '25-35°C',
      visiteurs_par_jour: 200,
    });

    const jungle = await Habitat.create({
      nom: 'Jungle', // ← Nom habitat ?
      description: 'Forêt tropicale luxuriante pleine de mystères',
      superficie: '8 Hectares',
      temperature: '28-35°C',
      visiteurs_par_jour: 150,
    });

    const marais = await Habitat.create({
      nom: 'Marais',
      description: 'Zone humide mystérieuse et sauvage',
      superficie: '5 hectares',
      temperature: '20-28°C',
      visiteurs_par_jour: 100,
    });

    // 3. LES ANIMAUX
    console.log('🦁 Création des animaux...');

    await Animal.create({
      prenom: 'Simba',
      race: 'Lion',
      habitat_id: savane.id,
    });

    await Animal.create({
      prenom: 'Nala',
      race: 'Lionne',
      habitat_id: savane.id,
    });

    await Animal.create({
      prenom: 'Pedro',
      race: 'Aligator',
      habitat_id: marais.id,
    });

    await Animal.create({
      prenom: 'Sera',
      race: 'Couleuvre',
      habitat_id: marais.id,
    });

    await Animal.create({
      prenom: 'Baloo',
      race: 'Ours',
      habitat_id: jungle.id,
    });

    await Animal.create({
      prenom: 'Hector',
      race: 'Ourang-otan',
      habitat_id: jungle.id,
    });

    // 4. LES SERVICES
    console.log('🏢 Création des services...');

    await Service.create({
      nom: 'Restauration',
      description: 'Service de restauration avec spécialités locales',
    });

    await Service.create({
      nom: 'Visite guidée gratuite',
      description: 'Découverte des habitats avec un guide expert',
    });

    await Service.create({
      nom: 'Petit train du zoo',
      description: 'Tour panoramique du zoo en petit train',
    });

    console.log('✅ Seeding terminé avec succès !');
    console.log('📊 Données de base créées :');
    console.log('   - 3 utilisateurs (admin, employé, vétérinaire)');
    console.log('   - 3 habitats (Savane, Jungle, Marais)');
    console.log('   - 6 animaux répartis dans les habitats');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
