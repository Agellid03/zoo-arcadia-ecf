const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Avis = sequelize.define('Avis', {
  pseudo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  texte: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'approuve', 'rejete'),
    defaultValue: 'en_attente',
    allowNull: false,
  },

  // RELATION : validé par employé
  employe_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
});

module.exports = Avis;
