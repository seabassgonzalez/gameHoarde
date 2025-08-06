const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  platform: {
    type: String,
    required: true,
    index: true
  },
  releaseDate: Date,
  developer: String,
  publisher: String,
  genres: [String],
  description: String,
  coverImage: String,
  screenshots: [String],
  barcode: String,
  region: String,
  rarity: {
    type: String,
    enum: ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Ultra Rare']
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5
  },
  metacriticScore: Number,
  esrbRating: String,
  rawgId: {
    type: Number,
    unique: true,
    sparse: true
  },
  slug: String,
  variations: [{
    name: String,
    description: String,
    barcode: String,
    coverImage: String
  }],
  metadata: {
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedDate: {
      type: Date,
      default: Date.now
    },
    lastModified: {
      type: Date,
      default: Date.now
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userSubmitted: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

gameSchema.index({ title: 'text', developer: 'text', publisher: 'text' });

module.exports = mongoose.model('Game', gameSchema);