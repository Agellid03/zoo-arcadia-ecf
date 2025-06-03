const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'employe', 'veterinaire'),
    allowNull: false,
  },
});

//Hook Sequelize - s'execute avant la création de l'utilisateur
User.beforeCreate(async (user) => {
  // Hash le mot de passe avant un "salt" de niveau 10
  user.password = await bcrypt.hash(user.password, 10);
});
module.exports = User;
