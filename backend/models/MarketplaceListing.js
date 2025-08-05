const mongoose = require('mongoose');

const marketplaceListingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  condition: {
    type: String,
    enum: ['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
    required: true
  },
  completeness: {
    type: String,
    enum: ['CIB', 'No Manual', 'Cart Only', 'Disc Only', 'Digital'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  shipping: {
    price: Number,
    methods: [String],
    estimatedDays: String
  },
  photos: [String],
  status: {
    type: String,
    enum: ['Active', 'Sold', 'Cancelled', 'Pending'],
    default: 'Active'
  },
  views: {
    type: Number,
    default: 0
  },
  watchers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  offers: [{
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    message: String,
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Withdrawn'],
      default: 'Pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  soldPrice: Number,
  soldDate: Date
}, {
  timestamps: true
});

marketplaceListingSchema.index({ title: 'text', description: 'text' });
marketplaceListingSchema.index({ game: 1, status: 1 });
marketplaceListingSchema.index({ seller: 1, status: 1 });

module.exports = mongoose.model('MarketplaceListing', marketplaceListingSchema);