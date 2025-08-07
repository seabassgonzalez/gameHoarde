// Migration: Add compound index for marketplace search optimization

module.exports = {
  async up(mongoose, session) {
    const MarketplaceListing = mongoose.model('MarketplaceListing');
    
    // Create compound index for common marketplace queries
    await MarketplaceListing.collection.createIndex(
      {
        status: 1,
        price: 1,
        condition: 1,
        createdAt: -1
      },
      { 
        name: 'marketplace_search_idx',
        session 
      }
    );
    
    // Add text index for searching listings
    await MarketplaceListing.collection.createIndex(
      {
        title: 'text',
        description: 'text'
      },
      {
        name: 'marketplace_text_idx',
        weights: {
          title: 10,
          description: 1
        },
        session
      }
    );
  },

  async down(mongoose, session) {
    const MarketplaceListing = mongoose.model('MarketplaceListing');
    
    await MarketplaceListing.collection.dropIndex('marketplace_search_idx', { session });
    await MarketplaceListing.collection.dropIndex('marketplace_text_idx', { session });
  }
};