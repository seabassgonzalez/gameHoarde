require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('../models/Game');
const User = require('../models/User');
const MarketplaceListing = require('../models/MarketplaceListing');
const rawgService = require('../services/rawgService');

async function quickPopulate() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if games already exist
    const gameCount = await Game.countDocuments();
    if (gameCount > 0) {
      console.log(`Database already has ${gameCount} games. Skipping game import.`);
    } else {
      console.log('Importing games from RAWG...');
      
      // Import 3 pages of popular games
      for (let page = 1; page <= 3; page++) {
        console.log(`Fetching page ${page}...`);
        const response = await rawgService.fetchGames(page, 20);
        
        for (const rawgGame of response.results) {
          try {
            const gameData = rawgService.transformGameData(rawgGame);
            const game = new Game(gameData);
            await game.save();
            console.log(`Imported: ${game.title}`);
          } catch (error) {
            console.error(`Failed to import ${rawgGame.name}:`, error.message);
          }
        }
      }
      
      const finalCount = await Game.countDocuments();
      console.log(`\nSuccessfully imported ${finalCount} games!`);
    }

    // Create some sample marketplace listings
    const games = await Game.find().limit(10);
    const users = await User.find().limit(5);
    
    if (users.length > 0 && games.length > 0) {
      console.log('\nCreating sample marketplace listings...');
      
      const conditions = ['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good'];
      const completeness = ['CIB', 'No Manual', 'Cart Only'];
      
      for (let i = 0; i < Math.min(games.length, 5); i++) {
        const listing = new MarketplaceListing({
          seller: users[0]._id,
          game: games[i]._id,
          condition: conditions[Math.floor(Math.random() * conditions.length)],
          completeness: completeness[Math.floor(Math.random() * completeness.length)],
          price: Math.floor(Math.random() * 100) + 10,
          description: `Selling my copy of ${games[i].title}. Great condition!`,
          images: [],
          status: 'active'
        });
        
        await listing.save();
        console.log(`Created listing for: ${games[i].title}`);
      }
      
      console.log('Sample marketplace listings created!');
    }

    console.log('\nPopulation complete!');
    console.log('You can now visit /games to see the game catalog');
    console.log('And /marketplace to see the listings');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the script
console.log('Starting quick population script...');
quickPopulate();