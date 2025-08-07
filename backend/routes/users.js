const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get user profile
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('gameCollection.game')
      .populate('wishlist.game');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user's profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return basic user info without populating references
    const userResponse = {
      id: user._id,
      _id: user._id,
      username: user.username,
      email: user.email,
      profile: user.profile,
      gameCollection: user.gameCollection || [],
      wishlist: user.wishlist || [],
      reputation: user.reputation,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Error in /users/me:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { displayName, bio, location, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        'profile.displayName': displayName,
        'profile.bio': bio,
        'profile.location': location,
        'profile.avatar': avatar
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;