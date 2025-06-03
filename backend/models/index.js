const sequelize = require('../database');
const Habitat = require('./Habitat');
const Animal = require('./Animal');
const User = require('./User');
const Service = require('./Service');
const Avis = require('./Avis');
const RapportVeterinaire = require('./RapportVeterinaire');
const ConsommationNourriture = require('./ConsommationNourriture');

// Associations Habitat - Animal
Habitat.hasMany(Animal, { foreignKey: 'habitat_id', as: 'animaux' });
Animal.belongsTo(Habitat, { foreignKey: 'habitat_id', as: 'habitat' });

// Association User - Avis (employé valide)
User.hasMany(Avis, { foreignKey: 'employe_id', as: 'avis_valides' });
Avis.belongsTo(User, { foreignKey: 'employe_id', as: 'employe' });

// Associations Animal - Rapport Vétérinaire
Animal.hasMany(RapportVeterinaire, { foreignKey: 'animal_id', as: 'rapports' });
RapportVeterinaire.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });

// Associations User - Rapport Vétérinaire(vétérinaire crée)
User.hasMany(RapportVeterinaire, {
  foreignKey: 'veterinaire_id',
  as: 'rapports_crees',
});
RapportVeterinaire.belongsTo(User, {
  foreignKey: 'veterinaire_id',
  as: 'veterinaire',
});

// Association Animal - Consommation Nourriture
Animal.hasMany(ConsommationNourriture, {
  foreignKey: 'animal_id',
  as: 'repas',
});
ConsommationNourriture.belongsTo(Animal, {
  foreignKey: 'animal_id',
  as: 'animal',
});

// Associations User - Consommation Nourriture (employé nourrit)
User.hasMany(ConsommationNourriture, {
  foreignKey: 'employe_id',
  as: 'repas_donnes',
});
ConsommationNourriture.belongsTo(User, {
  foreignKey: 'employe_id',
  as: 'employe',
});

module.exports = {
  sequelize,
  Habitat,
  Animal,
  User,
  Service,
  Avis,
  RapportVeterinaire,
  ConsommationNourriture,
};
