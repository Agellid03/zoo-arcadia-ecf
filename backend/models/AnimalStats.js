const mongoose = require('mongoose');

const animalStatsSchema = new mongoose.Schema(
  {
    animal_id: {
      type: Number,
      required: true,
      unique: true,
    },
    animal_name: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    last_viewed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('AnimalStats', animalStatsSchema);
