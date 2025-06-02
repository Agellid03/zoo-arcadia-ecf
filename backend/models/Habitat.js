const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Habitat = sequelize.define('Habitat', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  superficie: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  temperature: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  visiteurs_par_jour: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Habitat;
