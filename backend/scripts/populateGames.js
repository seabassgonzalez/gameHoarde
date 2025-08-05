require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('../models/Game');
const rawgService = require('../services/rawgService');

async function populateGames(totalGames = 500) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gamehorde', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const pageSize = 40; // RAWG allows up to 40 per page
    const totalPages = Math.ceil(totalGames / pageSize);
    let gamesAdded = 0;
    let gamesSkipped = 0;

    console.log(`Starting to fetch ${totalGames} games from RAWG API...`);

    for (let page = 1; page <= totalPages; page++) {
      try {
        console.log(`Fetching page ${page}/${totalPages}...`);
        const response = await rawgService.fetchGames(page, pageSize);
        
        for (const rawgGame of response.results) {
          if (gamesAdded >= totalGames) break;

          try {
            // Check if game already exists
            const existingGame = await Game.findOne({ 
              $or: [
                { rawgId: rawgGame.id },
                { title: rawgGame.name, platform: rawgService.extractPrimaryPlatform(rawgGame.platforms) }
              ]
            });

            if (existingGame) {
              console.log(`Game already exists: ${rawgGame.name}`);
              gamesSkipped++;
              continue;
            }

            // Fetch detailed information for better data
            let gameDetails = rawgGame;
            try {
              const detailedResponse = await rawgService.fetchGameDetails(rawgGame.id);
              gameDetails = { ...rawgGame, ...detailedResponse };
            } catch (detailError) {
              console.log(`Could not fetch details for ${rawgGame.name}, using basic data`);
            }

            // Transform and save the game
            const gameData = rawgService.transformGameData(gameDetails);
            const game = new Game(gameData);
            await game.save();
            
            gamesAdded++;
            console.log(`Added game ${gamesAdded}: ${game.title} (${game.platform})`);

            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));

          } catch (error) {
            console.error(`Error adding game ${rawgGame.name}:`, error.message);
          }
        }

        if (gamesAdded >= totalGames) break;

        // Delay between pages to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error fetching page ${page}:`, error.message);
      }
    }

    console.log(`\nPopulation complete!`);
    console.log(`Games added: ${gamesAdded}`);
    console.log(`Games skipped (already existed): ${gamesSkipped}`);

  } catch (error) {
    console.error('Error populating games:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Check if API key is set
if (!process.env.RAWG_API_KEY || process.env.RAWG_API_KEY === 'YOUR_API_KEY_HERE') {
  console.error('\n⚠️  RAWG API Key not set!');
  console.error('Please follow these steps:');
  console.error('1. Go to https://rawg.io/apidocs');
  console.error('2. Click "Get API Key" and create a free account');
  console.error('3. Copy your API key');
  console.error('4. Add it to your .env file: RAWG_API_KEY=your_key_here\n');
  process.exit(1);
}

// Run the script
const gamesToFetch = process.argv[2] ? parseInt(process.argv[2]) : 500;
console.log(`\nStarting to populate ${gamesToFetch} games from RAWG API...`);
console.log('This may take several minutes...\n');

populateGames(gamesToFetch);