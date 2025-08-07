const Bull = require('bull');
const config = require('../config');

// Create queues
const gameImportQueue = new Bull('game-import', {
  redis: config.redis.url
});

const imageProcessingQueue = new Bull('image-processing', {
  redis: config.redis.url
});

const emailQueue = new Bull('email', {
  redis: config.redis.url
});

const analyticsQueue = new Bull('analytics', {
  redis: config.redis.url
});

// Queue configurations
const defaultJobOptions = {
  removeOnComplete: 100,
  removeOnFail: 50,
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000
  }
};

// Add job helpers
const addGameImportJob = (data) => {
  return gameImportQueue.add('import-games', data, {
    ...defaultJobOptions,
    timeout: 300000 // 5 minutes
  });
};

const addImageProcessingJob = (data) => {
  return imageProcessingQueue.add('process-image', data, {
    ...defaultJobOptions,
    timeout: 60000 // 1 minute
  });
};

const addEmailJob = (data) => {
  return emailQueue.add('send-email', data, {
    ...defaultJobOptions,
    attempts: 5
  });
};

const addAnalyticsJob = (data) => {
  return analyticsQueue.add('track-event', data, {
    ...defaultJobOptions,
    priority: -1 // Low priority
  });
};

module.exports = {
  gameImportQueue,
  imageProcessingQueue,
  emailQueue,
  analyticsQueue,
  addGameImportJob,
  addImageProcessingJob,
  addEmailJob,
  addAnalyticsJob
};