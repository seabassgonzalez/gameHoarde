require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('../models/Game');
const User = require('../models/User');
const MarketplaceListing = require('../models/MarketplaceListing');

const conditions = ['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
const completeness = ['CIB', 'No Manual', 'Cart Only', 'Disc Only', 'Digital'];

const listingDescriptions = [
  "Excellent condition, kept in a smoke-free home. All original contents included.",
  "Rare find! Complete with box and manual. Minor shelf wear on box.",
  "Cart only but in perfect working condition. Tested and plays great!",
  "Collector's edition with all original extras. Box has some wear but game is pristine.",
  "Well-maintained copy, includes manual. Great addition to any collection.",
  "Vintage gem! Some wear consistent with age but fully functional.",
  "Complete in box with all inserts. Stored in protective case.",
  "Authentic and tested. Price negotiable for serious buyers.",
  "Moving sale - priced to sell quickly. First come, first served!",
  "Duplicate from my collection. My loss is your gain!"
];

async function createMarketplaceListings() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gamehorde', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Get a user to be the seller (we'll use the first user we find)
    const seller = await User.findOne();
    if (!seller) {
      console.error('No users found. Please create a user first.');
      return;
    }
    console.log(`Using seller: ${seller.username}`);

    // Get random games from the database
    const totalGames = await Game.countDocuments();
    const gamesToList = 20; // Number of marketplace listings to create
    
    if (totalGames === 0) {
      console.error('No games found in database. Please run populateGames.js first.');
      return;
    }

    // Clear existing marketplace listings
    await MarketplaceListing.deleteMany({});
    console.log('Cleared existing marketplace listings');

    const listings = [];
    const usedGameIds = new Set();

    for (let i = 0; i < Math.min(gamesToList, totalGames); i++) {
      let game;
      let attempts = 0;
      
      // Get a random game that hasn't been used yet
      do {
        const randomSkip = Math.floor(Math.random() * totalGames);
        game = await Game.findOne().skip(randomSkip);
        attempts++;
      } while (usedGameIds.has(game._id.toString()) && attempts < 50);

      if (attempts >= 50) {
        console.log('Could not find enough unique games');
        break;
      }

      usedGameIds.add(game._id.toString());

      // Generate random listing data
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const completenessValue = completeness[Math.floor(Math.random() * completeness.length)];
      
      // Price based on condition and game age
      let basePrice = Math.random() * 100 + 20; // $20-120 base
      
      // Adjust price based on condition
      const conditionMultiplier = {
        'Mint': 1.5,
        'Near Mint': 1.3,
        'Excellent': 1.1,
        'Very Good': 0.9,
        'Good': 0.7,
        'Fair': 0.5,
        'Poor': 0.3
      };
      
      basePrice *= conditionMultiplier[condition];
      
      // Adjust for completeness
      const completenessMultiplier = {
        'CIB': 1.2,
        'No Manual': 0.9,
        'Cart Only': 0.7,
        'Disc Only': 0.7,
        'Digital': 0.8
      };
      
      basePrice *= completenessMultiplier[completenessValue];
      
      // Round to nearest .99
      const price = Math.floor(basePrice) + 0.99;

      const listing = new MarketplaceListing({
        game: game._id,
        seller: seller._id,
        title: `${game.title} - ${game.platform}`,
        price,
        condition,
        completeness: completenessValue,
        description: listingDescriptions[Math.floor(Math.random() * listingDescriptions.length)],
        photos: game.coverImage ? [game.coverImage] : [],
        status: 'Active',
        shipping: {
          price: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 10) + 5, // Free or $5-15
          methods: ['USPS Priority', 'UPS Ground', 'FedEx'],
          estimatedDays: `${Math.floor(Math.random() * 5) + 3}-${Math.floor(Math.random() * 5) + 7} business days`
        },
        views: Math.floor(Math.random() * 200), // 0-200 views
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
      });

      await listing.save();
      listings.push(listing);
      
      console.log(`Created listing ${i + 1}: ${game.title} (${game.platform}) - $${price.toFixed(2)} - ${condition}`);
    }

    console.log(`\nSuccessfully created ${listings.length} marketplace listings!`);

    // Add some of these listings to the seller's collection
    const collectionItems = [];
    for (let i = 0; i < Math.min(5, listings.length); i++) {
      collectionItems.push({
        game: listings[i].game,
        condition: listings[i].condition,
        completeness: listings[i].completeness,
        purchasePrice: Math.floor(listings[i].price * 0.6), // Bought for 60% of selling price
        purchaseDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        forSale: true,
        salePrice: listings[i].price,
        notes: 'Listed on marketplace'
      });
    }

    // Update seller's collection
    seller.gameCollection.push(...collectionItems);
    await seller.save();
    console.log(`\nAdded ${collectionItems.length} games to seller's collection`);

  } catch (error) {
    console.error('Error creating marketplace listings:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
console.log('Creating example marketplace listings...\n');
createMarketplaceListings();