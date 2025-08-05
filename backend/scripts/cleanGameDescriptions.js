require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('../models/Game');
const { stripHtml } = require('../utils/stripHtml');

async function cleanDescriptions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gamehorde', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Get all games with descriptions
    const games = await Game.find({ description: { $exists: true, $ne: '' } });
    console.log(`Found ${games.length} games with descriptions to clean`);

    let cleanedCount = 0;
    let skippedCount = 0;

    for (const game of games) {
      // Check if description contains HTML
      if (game.description.includes('<') || game.description.includes('&')) {
        const cleanedDescription = stripHtml(game.description);
        
        if (cleanedDescription !== game.description) {
          game.description = cleanedDescription;
          await game.save();
          cleanedCount++;
          console.log(`Cleaned description for: ${game.title}`);
        } else {
          skippedCount++;
        }
      } else {
        skippedCount++;
      }
    }

    console.log(`\nCleaning complete!`);
    console.log(`Descriptions cleaned: ${cleanedCount}`);
    console.log(`Descriptions skipped: ${skippedCount}`);

  } catch (error) {
    console.error('Error cleaning descriptions:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
console.log('Starting to clean game descriptions...\n');
cleanDescriptions();