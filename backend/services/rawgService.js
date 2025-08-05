const axios = require('axios');
const { stripHtml } = require('../utils/stripHtml');

// RAWG API - Free video game database
// Get your free API key at: https://rawg.io/apidocs
const RAWG_API_KEY = process.env.RAWG_API_KEY || 'YOUR_API_KEY_HERE';
const RAWG_BASE_URL = 'https://api.rawg.io/api';

class RAWGService {
  constructor() {
    this.client = axios.create({
      baseURL: RAWG_BASE_URL,
      params: {
        key: RAWG_API_KEY
      }
    });
  }

  // Fetch games with pagination
  async fetchGames(page = 1, pageSize = 20) {
    try {
      const response = await this.client.get('/games', {
        params: {
          page,
          page_size: pageSize,
          ordering: '-rating' // Get highest rated games first
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching games from RAWG:', error.message);
      throw error;
    }
  }

  // Fetch detailed game information
  async fetchGameDetails(gameId) {
    try {
      const response = await this.client.get(`/games/${gameId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching game details for ID ${gameId}:`, error.message);
      throw error;
    }
  }

  // Transform RAWG game data to our schema
  transformGameData(rawgGame) {
    return {
      title: rawgGame.name,
      platform: this.extractPrimaryPlatform(rawgGame.platforms),
      developer: this.extractDeveloper(rawgGame),
      publisher: this.extractPublisher(rawgGame),
      releaseDate: rawgGame.released ? new Date(rawgGame.released) : null,
      genres: rawgGame.genres ? rawgGame.genres.map(g => g.name) : [],
      description: stripHtml(rawgGame.description_raw || rawgGame.description || ''),
      coverImage: rawgGame.background_image,
      metacriticScore: rawgGame.metacritic,
      esrbRating: rawgGame.esrb_rating ? rawgGame.esrb_rating.name : null,
      rawgId: rawgGame.id,
      slug: rawgGame.slug
    };
  }

  extractPrimaryPlatform(platforms) {
    if (!platforms || platforms.length === 0) return 'Unknown';
    
    // Priority order for platforms
    const priorityPlatforms = [
      'PlayStation 5', 'PlayStation 4', 'PlayStation 3', 'PlayStation 2', 'PlayStation',
      'Xbox Series S/X', 'Xbox One', 'Xbox 360', 'Xbox',
      'Nintendo Switch', 'Wii U', 'Wii', 'GameCube', 'Nintendo 64', 'SNES', 'NES',
      'PC', 'macOS', 'Linux'
    ];

    for (const priority of priorityPlatforms) {
      const found = platforms.find(p => p.platform.name === priority);
      if (found) return found.platform.name;
    }

    return platforms[0].platform.name;
  }

  extractDeveloper(game) {
    if (!game.developers || game.developers.length === 0) return 'Unknown';
    return game.developers[0].name;
  }

  extractPublisher(game) {
    if (!game.publishers || game.publishers.length === 0) return 'Unknown';
    return game.publishers[0].name;
  }
}

module.exports = new RAWGService();