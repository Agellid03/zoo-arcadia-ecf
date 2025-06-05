const mongoose = require('mongoose');

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🍃 MongoDB Atlas connecté !');
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error);
  }
};

module.exports = connectMongoDB;
