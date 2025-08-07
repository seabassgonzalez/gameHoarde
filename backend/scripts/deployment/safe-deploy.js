#!/usr/bin/env node

const mongoose = require('mongoose');
const migrationRunner = require('../../migrations');
const { logger } = require('../../utils/logger');

// Safe deployment script with migration support
async function safeDeploy() {
  let connection;
  
  try {
    // 1. Connect to database
    logger.info('Connecting to database...');
    connection = await mongoose.connect(process.env.MONGODB_URI);
    
    // 2. Check migration status
    logger.info('Checking migration status...');
    await migrationRunner.status();
    
    // 3. Create backup before migrations
    if (process.env.SKIP_BACKUP !== 'true') {
      logger.info('Creating database backup...');
      await createBackup();
    }
    
    // 4. Run migrations in transaction
    logger.info('Running migrations...');
    await migrationRunner.up();
    
    // 5. Validate schema changes
    logger.info('Validating schema changes...');
    await validateSchemas();
    
    // 6. Run smoke tests
    logger.info('Running smoke tests...');
    await runSmokeTests();
    
    logger.info('Deployment preparation complete!');
    process.exit(0);
    
  } catch (error) {
    logger.error('Deployment failed:', error);
    
    // Attempt rollback if migrations failed
    if (error.message.includes('migration')) {
      logger.info('Attempting migration rollback...');
      try {
        await migrationRunner.down();
        logger.info('Rollback successful');
      } catch (rollbackError) {
        logger.error('Rollback failed:', rollbackError);
      }
    }
    
    process.exit(1);
    
  } finally {
    if (connection) {
      await mongoose.disconnect();
    }
  }
}

// Create database backup
async function createBackup() {
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `backups/pre-deploy-${timestamp}`;
  
  try {
    await execAsync(`mongodump --uri="${process.env.MONGODB_URI}" --out="${backupPath}"`);
    logger.info(`Backup created at: ${backupPath}`);
  } catch (error) {
    throw new Error(`Backup failed: ${error.message}`);
  }
}

// Validate that schemas match database
async function validateSchemas() {
  const models = ['User', 'Game', 'MarketplaceListing'];
  
  for (const modelName of models) {
    const Model = mongoose.model(modelName);
    
    // Get a sample document
    const sample = await Model.findOne();
    if (!sample) continue;
    
    // Validate against schema
    const validation = sample.validateSync();
    if (validation) {
      throw new Error(`Schema validation failed for ${modelName}: ${validation.message}`);
    }
  }
  
  logger.info('All schemas validated successfully');
}

// Run basic smoke tests
async function runSmokeTests() {
  const tests = [
    // Test database connectivity
    async () => {
      const admin = mongoose.connection.db.admin();
      await admin.ping();
    },
    
    // Test basic queries
    async () => {
      const User = mongoose.model('User');
      await User.findOne();
    },
    
    // Test indexes
    async () => {
      const Game = mongoose.model('Game');
      const indexes = await Game.collection.getIndexes();
      if (!indexes['title_text_developer_text_publisher_text']) {
        throw new Error('Text index missing on Game collection');
      }
    }
  ];
  
  for (let i = 0; i < tests.length; i++) {
    try {
      await tests[i]();
      logger.info(`Smoke test ${i + 1}/${tests.length} passed`);
    } catch (error) {
      throw new Error(`Smoke test ${i + 1} failed: ${error.message}`);
    }
  }
}

// Run the deployment
safeDeploy();