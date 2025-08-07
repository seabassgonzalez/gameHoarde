const { imageProcessingQueue } = require('../queues');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { logger } = require('../utils/logger');

// Image sizes for different use cases
const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 }
};

// Process image jobs
imageProcessingQueue.process('process-image', async (job) => {
  const { filePath, gameId, userId } = job.data;
  
  try {
    logger.info(`Processing image: ${filePath}`);
    
    const inputPath = path.join(__dirname, '..', filePath);
    const dir = path.dirname(inputPath);
    const filename = path.basename(inputPath, path.extname(inputPath));
    const ext = '.webp'; // Convert all images to WebP for better compression
    
    // Validate file exists
    await fs.access(inputPath);
    
    // Create processed images
    const processedImages = {};
    let processed = 0;
    
    for (const [sizeName, dimensions] of Object.entries(IMAGE_SIZES)) {
      const outputFilename = `${filename}-${sizeName}${ext}`;
      const outputPath = path.join(dir, outputFilename);
      
      await sharp(inputPath)
        .resize(dimensions.width, dimensions.height, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 85 })
        .toFile(outputPath);
      
      processedImages[sizeName] = outputPath.replace(path.join(__dirname, '..'), '');
      
      processed++;
      await job.progress(Math.floor((processed / Object.keys(IMAGE_SIZES).length) * 90));
    }
    
    // Generate blur placeholder
    const placeholderData = await sharp(inputPath)
      .resize(20, 20, { fit: 'cover' })
      .blur(10)
      .webp({ quality: 50 })
      .toBuffer();
    
    processedImages.placeholder = `data:image/webp;base64,${placeholderData.toString('base64')}`;
    
    // Remove original file to save space (optional)
    if (process.env.DELETE_ORIGINAL_IMAGES === 'true') {
      await fs.unlink(inputPath);
    }
    
    await job.progress(100);
    
    const result = {
      gameId,
      userId,
      originalPath: filePath,
      processedImages,
      processingDate: new Date()
    };
    
    logger.info('Image processing completed:', result);
    
    return result;
    
  } catch (error) {
    logger.error('Image processing job failed:', error);
    throw error;
  }
});

// Clean up old images periodically
imageProcessingQueue.add('cleanup-old-images', {}, {
  repeat: {
    cron: '0 2 * * *' // Run at 2 AM daily
  }
});

imageProcessingQueue.process('cleanup-old-images', async (job) => {
  logger.info('Starting old images cleanup');
  
  const uploadsDir = path.join(__dirname, '..', 'uploads', 'games');
  const files = await fs.readdir(uploadsDir);
  const now = Date.now();
  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  
  let deleted = 0;
  
  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    const stats = await fs.stat(filePath);
    
    if (now - stats.mtime.getTime() > maxAge) {
      await fs.unlink(filePath);
      deleted++;
    }
  }
  
  logger.info(`Cleanup completed: ${deleted} files deleted`);
  return { deleted };
});

module.exports = imageProcessingQueue;