const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const rawgService = require('../services/rawgService');
const auth = require('../middleware/auth');

// Import games from RAWG API (admin only)
router.post('/import-from-rawg', auth, async (req, res) => {
  try {
    // In a real app, you'd check if user is admin
    const { page = 1, pageSize = 20 } = req.body;
    
    const response = await rawgService.fetchGames(page, pageSize);
    let imported = 0;
    let skipped = 0;
    
    for (const rawgGame of response.results) {
      try {
        // Check if game already exists
        const existingGame = await Game.findOne({ 
          $or: [
            { rawgId: rawgGame.id },
            { title: rawgGame.name, platform: rawgService.extractPrimaryPlatform(rawgGame.platforms) }
          ]
        });

        if (existingGame) {
          skipped++;
          continue;
        }

        // Transform and save the game
        const gameData = rawgService.transformGameData(rawgGame);
        const game = new Game(gameData);
        await game.save();
        imported++;

      } catch (error) {
        console.error(`Error importing game ${rawgGame.name}:`, error.message);
      }
    }
    
    res.json({
      message: 'Import completed',
      imported,
      skipped,
      total: response.results.length
    });
    
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import games' });
  }
});

// Search RAWG API for games
router.get('/search-rawg', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const response = await rawgService.client.get('/games', {
      params: {
        search: query,
        page,
        page_size: 10
      }
    });
    
    const games = response.data.results.map(game => rawgService.transformGameData(game));
    
    res.json({
      games,
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search games' });
  }
});

module.exports = router;