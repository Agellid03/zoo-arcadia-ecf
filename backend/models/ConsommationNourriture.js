const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const ConsommationNourriture = sequelize.define('ConsommationNourriture', {
  // Données temporaires
  date_consommation: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  heure_consommation: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Données nourriture
  nourriture_donnee: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // Relations
  animal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Animals',
      key: 'id',
    },
  },
  employe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
});

module.exports = ConsommationNourriture;
