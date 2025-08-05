require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('../models/Game');

async function fixGame() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gamehorde', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find the game
    const game = await Game.findOne({ 
      title: 'Donkey Kong Bananza',
      platform: 'Nintendo Switch 2' 
    });

    if (!game) {
      console.log('Game not found');
      return;
    }

    console.log('Found game:', game.title);
    
    // Update with a placeholder image for now
    game.coverImage = 'https://via.placeholder.com/300x400.png?text=Donkey+Kong+Bananza';
    await game.save();
    
    console.log('Updated game with placeholder image');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

fixGame();