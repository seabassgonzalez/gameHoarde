const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const User = require('../models/User');
const MarketplaceListing = require('../models/MarketplaceListing');
const authMiddleware = require('../middleware/auth');

// Populate marketplace with dummy listings
router.post('/populate-marketplace', authMiddleware, async (req, res) => {
  try {
    const { count = 10 } = req.body;
    
    // Get games and users
    const games = await Game.find().limit(50);
    const users = await User.find().limit(10);
    
    if (games.length === 0) {
      return res.status(400).json({ error: 'No games found. Please import games first.' });
    }
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'No users found. Please create user accounts first.' });
    }
    
    const conditions = ['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good', 'Fair'];
    const completeness = ['CIB', 'No Manual', 'Cart Only', 'Disc Only'];
    const titles = [
      'Mint condition!',
      'Rare find!',
      'Great deal!',
      'Collector\'s item',
      'Must sell!',
      'Pristine copy',
      'Complete in box',
      'Tested & working'
    ];
    
    const descriptions = [
      'From my personal collection',
      'Smoke-free home',
      'Ships next day',
      'Bundle deals available',
      'Priced to sell',
      'Check my other listings',
      'Moving sale',
      'Downsizing collection'
    ];
    
    const created = [];
    const errors = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const game = games[Math.floor(Math.random() * games.length)];
        const seller = users[Math.floor(Math.random() * users.length)];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const complete = completeness[Math.floor(Math.random() * completeness.length)];
        const title = titles[Math.floor(Math.random() * titles.length)];
        const desc = descriptions[Math.floor(Math.random() * descriptions.length)];
        
        // Price based on condition
        let basePrice = Math.random() * 80 + 20; // $20-100
        if (condition === 'Mint') basePrice *= 1.5;
        if (condition === 'Fair') basePrice *= 0.6;
        if (complete === 'CIB') basePrice *= 1.2;
        if (complete === 'Cart Only' || complete === 'Disc Only') basePrice *= 0.7;
        
        const listing = new MarketplaceListing({
          seller: seller._id,
          game: game._id,
          title: `${game.title} - ${title}`,
          condition,
          completeness: complete,
          price: Math.round(basePrice),
          description: `${desc}\n\n${game.title} for ${game.platform} in ${condition.toLowerCase()} condition.`,
          photos: game.coverImage ? [game.coverImage] : [],
          status: 'Active',
          views: Math.floor(Math.random() * 200),
          shipping: {
            price: Math.random() > 0.5 ? Math.round(Math.random() * 10 + 5) : 0,
            methods: ['USPS Priority', 'UPS Ground'],
            estimatedDays: '3-5 business days'
          }
        });
        
        await listing.save();
        created.push({
          id: listing._id,
          title: listing.title,
          price: listing.price
        });
        
      } catch (error) {
        errors.push(error.message);
      }
    }
    
    res.json({
      message: 'Marketplace population complete',
      created: created.length,
      errors: errors.length,
      listings: created
    });
    
  } catch (error) {
    console.error('Marketplace population error:', error);
    res.status(500).json({ error: 'Failed to populate marketplace' });
  }
});

// Clear all marketplace listings (be careful!)
router.delete('/clear-marketplace', authMiddleware, async (req, res) => {
  try {
    const result = await MarketplaceListing.deleteMany({});
    res.json({
      message: 'Marketplace cleared',
      deleted: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear marketplace' });
  }
});

// Get marketplace stats
router.get('/marketplace-stats', authMiddleware, async (req, res) => {
  try {
    const totalListings = await MarketplaceListing.countDocuments();
    const activeListings = await MarketplaceListing.countDocuments({ status: 'Active' });
    const soldListings = await MarketplaceListing.countDocuments({ status: 'Sold' });
    const avgPrice = await MarketplaceListing.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ]);
    
    res.json({
      total: totalListings,
      active: activeListings,
      sold: soldListings,
      averagePrice: avgPrice[0]?.avgPrice || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

module.exports = router;