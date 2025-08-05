const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    displayName: String,
    avatar: String,
    bio: String,
    location: String,
    joinDate: {
      type: Date,
      default: Date.now
    }
  },
  gameCollection: [{
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    },
    condition: {
      type: String,
      enum: ['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor']
    },
    completeness: {
      type: String,
      enum: ['CIB', 'No Manual', 'Cart Only', 'Disc Only', 'Digital']
    },
    notes: String,
    purchasePrice: Number,
    purchaseDate: Date,
    forSale: {
      type: Boolean,
      default: false
    },
    salePrice: Number,
    photos: [String],
    addedDate: {
      type: Date,
      default: Date.now
    }
  }],
  wishlist: [{
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    maxPrice: Number,
    notes: String,
    addedDate: {
      type: Date,
      default: Date.now
    }
  }],
  reputation: {
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    completedTransactions: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);