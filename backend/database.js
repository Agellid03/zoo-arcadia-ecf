const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './zoo_arcadia.db',
  logging: false,
});

module.exports = sequelize;
