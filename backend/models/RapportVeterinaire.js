const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const RapportVeterinaire = sequelize.define('RapportVeterinaire', {
  etat_animal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nourriture_proposee: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grammage_nourriture: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date_passage: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  detail_etat: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  // RELATIONS
  animal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Animals',
      key: 'id',
    },
  },
  veterinaire_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
});

module.exports = RapportVeterinaire;
