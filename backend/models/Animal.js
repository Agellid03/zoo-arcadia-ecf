const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Animal = sequelize.define('Animal', {
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  race: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // RELATION: Un animal a un habitat
  habitat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Habitats',
      key: 'id',
    },
  },
});

module.exports = Animal;
