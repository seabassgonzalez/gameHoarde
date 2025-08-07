require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('../models/Game');
const User = require('../models/User');
const MarketplaceListing = require('../models/MarketplaceListing');

// Sample data for generating realistic listings
const listingTemplates = [
  { title: "Mint condition, complete in box!", condition: "Mint", completeness: "CIB", priceMultiplier: 1.5 },
  { title: "Great condition, no manual", condition: "Near Mint", completeness: "No Manual", priceMultiplier: 0.8 },
  { title: "Cart only, tested and working", condition: "Excellent", completeness: "Cart Only", priceMultiplier: 0.6 },
  { title: "Complete with all inserts", condition: "Near Mint", completeness: "CIB", priceMultiplier: 1.3 },
  { title: "Some wear but plays perfectly", condition: "Very Good", completeness: "CIB", priceMultiplier: 1.0 },
  { title: "Collector's item, pristine condition", condition: "Mint", completeness: "CIB", priceMultiplier: 2.0 },
  { title: "Good starter copy", condition: "Good", completeness: "Cart Only", priceMultiplier: 0.5 },
  { title: "Disc only, no scratches", condition: "Excellent", completeness: "Disc Only", priceMultiplier: 0.7 },
];

const descriptions = [
  "Been in my collection for years, time to let someone else enjoy it.",
  "Downsizing my collection. All games tested and working.",
  "From a smoke-free, pet-free home.",
  "Rare find! Don't miss out on this classic.",
  "Priced to sell quickly. First come, first served.",
  "Adult owned, carefully stored in protective case.",
  "Moving sale - all games must go!",
  "Duplicate in my collection, my loss is your gain.",
  "Hard to find in this condition!",
  "Check out my other listings for bundle deals.",
];

async function populateMarketplace(numberOfListings = 20) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all games and users
    const games = await Game.find();
    const users = await User.find();

    if (games.length === 0) {
      console.error('No games found! Please populate games first.');
      return;
    }

    if (users.length === 0) {
      console.error('No users found! Please create some user accounts first.');
      return;
    }

    console.log(`Found ${games.length} games and ${users.length} users`);
    console.log(`Creating ${numberOfListings} marketplace listings...`);

    const createdListings = [];

    for (let i = 0; i < numberOfListings; i++) {
      // Random selections
      const game = games[Math.floor(Math.random() * games.length)];
      const seller = users[Math.floor(Math.random() * users.length)];
      const template = listingTemplates[Math.floor(Math.random() * listingTemplates.length)];
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];

      // Calculate price based on game age and condition
      const basePrice = Math.random() * 60 + 20; // $20-80 base
      const finalPrice = Math.round(basePrice * template.priceMultiplier);

      // Random date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      const listing = new MarketplaceListing({
        seller: seller._id,
        game: game._id,
        title: `${game.title} - ${template.title}`,
        condition: template.condition,
        completeness: template.completeness,
        price: finalPrice,
        description: `${description}\n\nGame: ${game.title}\nPlatform: ${game.platform}`,
        images: game.coverImage ? [game.coverImage] : [],
        status: 'active',
        viewCount: Math.floor(Math.random() * 100),
        createdAt: createdAt,
        location: 'United States',
        shippingAvailable: Math.random() > 0.3,
        localPickupAvailable: Math.random() > 0.5,
      });

      try {
        await listing.save();
        createdListings.push(listing);
        console.log(`Created listing ${i + 1}: ${game.title} by ${seller.username} - $${finalPrice}`);
      } catch (error) {
        console.error(`Failed to create listing: ${error.message}`);
      }
    }

    // Create some offers on random listings
    console.log('\nCreating sample offers...');
    const activeListings = createdListings.slice(0, 5);
    
    for (const listing of activeListings) {
      const offerCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < offerCount; i++) {
        const offerer = users[Math.floor(Math.random() * users.length)];
        if (offerer._id.toString() === listing.seller.toString()) continue;

        const offerAmount = Math.round(listing.price * (0.7 + Math.random() * 0.25));
        
        listing.offers.push({
          user: offerer._id,
          amount: offerAmount,
          message: "Would you accept this offer?",
          status: 'pending',
          createdAt: new Date()
        });
      }
      
      await listing.save();
      console.log(`Added ${listing.offers.length} offers to ${listing.title}`);
    }

    console.log(`\nSuccessfully created ${createdListings.length} marketplace listings!`);
    console.log('Visit /marketplace to see the listings');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Check command line arguments
const numberOfListings = process.argv[2] ? parseInt(process.argv[2]) : 20;

console.log('Starting marketplace population...');
populateMarketplace(numberOfListings);