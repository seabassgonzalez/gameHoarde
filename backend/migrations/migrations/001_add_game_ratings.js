// Example migration: Add user ratings to games

module.exports = {
  async up(mongoose, session) {
    const Game = mongoose.model('Game');
    
    // Add new fields to all existing games
    await Game.updateMany(
      {},
      {
        $set: {
          'ratings.average': 0,
          'ratings.count': 0,
          'ratings.distribution': {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0
          }
        }
      },
      { session }
    );
    
    // Create index for rating queries
    await Game.collection.createIndex(
      { 'ratings.average': -1 },
      { session }
    );
  },

  async down(mongoose, session) {
    const Game = mongoose.model('Game');
    
    // Remove the fields
    await Game.updateMany(
      {},
      {
        $unset: {
          'ratings': 1
        }
      },
      { session }
    );
    
    // Drop the index
    await Game.collection.dropIndex('ratings.average_-1', { session });
  }
};