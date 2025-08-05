const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Add game to collection
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const {
      gameId,
      condition,
      completeness,
      notes,
      purchasePrice,
      purchaseDate,
      photos
    } = req.body;

    const user = await User.findById(req.user.userId);
    
    // Check if game already in collection
    const existingItem = user.collection.find(
      item => item.game.toString() === gameId
    );
    
    if (existingItem) {
      return res.status(400).json({ error: 'Game already in collection' });
    }

    user.collection.push({
      game: gameId,
      condition,
      completeness,
      notes,
      purchasePrice,
      purchaseDate,
      photos
    });

    await user.save();
    
    // Populate the newly added game
    await user.populate('collection.game');
    
    res.json(user.collection[user.collection.length - 1]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update collection item
router.put('/item/:itemId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const item = user.collection.id(req.params.itemId);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found in collection' });
    }

    Object.assign(item, req.body);
    await user.save();
    
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove from collection
router.delete('/item/:itemId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.collection.pull(req.params.itemId);
    await user.save();
    
    res.json({ message: 'Item removed from collection' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add to wishlist
router.post('/wishlist/add', authMiddleware, async (req, res) => {
  try {
    const { gameId, priority, maxPrice, notes } = req.body;

    const user = await User.findById(req.user.userId);
    
    // Check if game already in wishlist
    const existingItem = user.wishlist.find(
      item => item.game.toString() === gameId
    );
    
    if (existingItem) {
      return res.status(400).json({ error: 'Game already in wishlist' });
    }

    user.wishlist.push({
      game: gameId,
      priority,
      maxPrice,
      notes
    });

    await user.save();
    await user.populate('wishlist.game');
    
    res.json(user.wishlist[user.wishlist.length - 1]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove from wishlist
router.delete('/wishlist/:itemId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.wishlist.pull(req.params.itemId);
    await user.save();
    
    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get collection stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('collection.game');
    
    const stats = {
      totalGames: user.collection.length,
      totalValue: user.collection.reduce((sum, item) => sum + (item.purchasePrice || 0), 0),
      platformBreakdown: {},
      conditionBreakdown: {}
    };

    user.collection.forEach(item => {
      // Platform breakdown
      const platform = item.game.platform;
      stats.platformBreakdown[platform] = (stats.platformBreakdown[platform] || 0) + 1;
      
      // Condition breakdown
      stats.conditionBreakdown[item.condition] = (stats.conditionBreakdown[item.condition] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;