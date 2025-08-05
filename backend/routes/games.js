const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const authMiddleware = require('../middleware/auth');
const { stripHtml } = require('../utils/stripHtml');

// Get all games with pagination and search
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      platform,
      genre,
      sortBy = 'title',
      order = 'asc'
    } = req.query;

    const query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (platform) {
      query.platform = platform;
    }
    
    if (genre) {
      query.genres = { $in: [genre] };
    }

    const totalGames = await Game.countDocuments(query);
    
    const games = await Game.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.json({
      games,
      totalPages: Math.ceil(totalGames / limit),
      currentPage: page,
      totalGames
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single game
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new game (authenticated users only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      platform,
      developer,
      publisher,
      releaseDate,
      genres,
      description,
      coverImage,
      barcode,
      region,
      rarity
    } = req.body;

    // Validate required fields
    if (!title || !platform) {
      return res.status(400).json({ error: 'Title and platform are required' });
    }

    // Check if game already exists
    const existingGame = await Game.findOne({
      title: { $regex: new RegExp(`^${title}$`, 'i') },
      platform
    });

    if (existingGame) {
      return res.status(400).json({ 
        error: 'A game with this title and platform already exists',
        existingGame: existingGame
      });
    }

    // Clean description if provided
    const cleanedDescription = description ? stripHtml(description) : '';

    const gameData = {
      title,
      platform,
      developer: developer || 'Unknown',
      publisher: publisher || 'Unknown',
      releaseDate: releaseDate ? new Date(releaseDate) : null,
      genres: genres || [],
      description: cleanedDescription,
      coverImage,
      barcode,
      region,
      rarity,
      metadata: {
        addedBy: req.user.userId,
        addedDate: new Date(),
        userSubmitted: true
      }
    };

    const game = new Game(gameData);
    await game.save();
    
    res.status(201).json(game);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Update game (authenticated users only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        'metadata.lastModified': new Date()
      },
      { new: true }
    );

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get platforms list
router.get('/metadata/platforms', async (req, res) => {
  try {
    const platforms = await Game.distinct('platform');
    res.json(platforms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get genres list
router.get('/metadata/genres', async (req, res) => {
  try {
    const genres = await Game.distinct('genres');
    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;