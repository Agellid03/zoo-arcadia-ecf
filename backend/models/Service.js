const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Service = sequelize.define('Service', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Service;
