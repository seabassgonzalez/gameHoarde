const express = require('express');
const router = express.Router();
const MarketplaceListing = require('../models/MarketplaceListing');
const Game = require('../models/Game');
const authMiddleware = require('../middleware/auth');

// Get all listings
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      platform,
      minPrice,
      maxPrice,
      condition,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = { status: 'Active' };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (platform) {
      const gameIds = await Game.find({ platform }).distinct('_id');
      query.game = { $in: gameIds };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (condition) {
      query.condition = condition;
    }

    const totalListings = await MarketplaceListing.countDocuments(query);
    
    const listings = await MarketplaceListing.find(query)
      .populate('game')
      .populate('seller', 'username profile.displayName reputation')
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.json({
      listings,
      totalPages: Math.ceil(totalListings / limit),
      currentPage: page,
      totalListings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await MarketplaceListing.findById(req.params.id)
      .populate('game')
      .populate('seller', 'username profile reputation')
      .populate('offers.buyer', 'username');

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Increment view count
    listing.views += 1;
    await listing.save();

    res.json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new listing
router.post('/', authMiddleware, async (req, res) => {
  try {
    const listing = new MarketplaceListing({
      ...req.body,
      seller: req.user.userId
    });

    await listing.save();
    await listing.populate('game seller');

    res.status(201).json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update listing
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const listing = await MarketplaceListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.seller.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    Object.assign(listing, req.body);
    await listing.save();

    res.json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Make offer
router.post('/:id/offer', authMiddleware, async (req, res) => {
  try {
    const { amount, message } = req.body;
    const listing = await MarketplaceListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.seller.toString() === req.user.userId) {
      return res.status(400).json({ error: 'Cannot make offer on own listing' });
    }

    listing.offers.push({
      buyer: req.user.userId,
      amount,
      message
    });

    await listing.save();
    
    res.json({ message: 'Offer submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept offer
router.post('/:id/offer/:offerId/accept', authMiddleware, async (req, res) => {
  try {
    const listing = await MarketplaceListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.seller.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const offer = listing.offers.id(req.params.offerId);
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    offer.status = 'Accepted';
    listing.status = 'Sold';
    listing.soldTo = offer.buyer;
    listing.soldPrice = offer.amount;
    listing.soldDate = new Date();

    // Reject all other offers
    listing.offers.forEach(o => {
      if (o._id.toString() !== req.params.offerId) {
        o.status = 'Rejected';
      }
    });

    await listing.save();

    res.json({ message: 'Offer accepted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add to watchlist
router.post('/:id/watch', authMiddleware, async (req, res) => {
  try {
    const listing = await MarketplaceListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (!listing.watchers.includes(req.user.userId)) {
      listing.watchers.push(req.user.userId);
      await listing.save();
    }

    res.json({ message: 'Added to watchlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;