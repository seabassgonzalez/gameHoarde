const { gameImportQueue } = require('../queues');
const Game = require('../models/Game');
const rawgService = require('../services/rawgService');
const { logger } = require('../utils/logger');

// Process game import jobs
gameImportQueue.process('import-games', async (job) => {
  const { page, pageSize, userId, importId } = job.data;
  
  try {
    logger.info(`Starting game import: page ${page}, size ${pageSize}`);
    
    // Update job progress
    await job.progress(10);
    
    // Fetch games from RAWG
    const response = await rawgService.fetchGames(page, pageSize);
    
    await job.progress(30);
    
    let imported = 0;
    let skipped = 0;
    let failed = 0;
    
    // Process each game
    for (let i = 0; i < response.results.length; i++) {
      const rawgGame = response.results[i];
      
      try {
        // Check if game exists
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

        // Fetch detailed game info
        const detailedGame = await rawgService.fetchGameDetails(rawgGame.id);
        
        // Transform and save
        const gameData = rawgService.transformGameData(detailedGame);
        gameData.metadata = {
          ...gameData.metadata,
          importedBy: userId,
          importId: importId,
          importDate: new Date()
        };
        
        const game = new Game(gameData);
        await game.save();
        imported++;
        
      } catch (error) {
        logger.error(`Failed to import game ${rawgGame.name}:`, error);
        failed++;
      }
      
      // Update progress
      const progress = 30 + Math.floor((i + 1) / response.results.length * 60);
      await job.progress(progress);
    }
    
    await job.progress(100);
    
    const result = {
      imported,
      skipped,
      failed,
      total: response.results.length,
      page,
      hasMore: !!response.next
    };
    
    logger.info('Game import completed:', result);
    
    return result;
    
  } catch (error) {
    logger.error('Game import job failed:', error);
    throw error;
  }
});

// Event handlers
gameImportQueue.on('completed', (job, result) => {
  logger.info(`Job ${job.id} completed:`, result);
});

gameImportQueue.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed:`, err);
});

gameImportQueue.on('stalled', (job) => {
  logger.warn(`Job ${job.id} stalled and will be retried`);
});

module.exports = gameImportQueue;