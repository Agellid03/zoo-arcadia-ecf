const sequelize = require('../database');
const Habitat = require('./Habitat');
const Animal = require('./Animal');

// ASSOCIATIONS
Habitat.hasMany(Animal, {
  foreignKey: 'habitat_id',
  as: 'animaux',
});

Animal.belongsTo(Habitat, {
  foreignKey: 'habitat_id',
  as: 'habitat',
});

module.exports = {
  sequelize,
  Habitat,
  Animal,
};
