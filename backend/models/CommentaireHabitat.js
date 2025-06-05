const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const CommentaireHabitat = sequelize.define('CommentaireHabitat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  habitat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Habitats',
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
  commentaire: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  statut_habitat: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'bon',
  },
  date_visite: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = CommentaireHabitat;
