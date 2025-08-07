const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs').promises;
const { logger } = require('../utils/logger');

// Migration schema
const migrationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  appliedAt: { type: Date, default: Date.now },
  version: { type: Number, required: true },
  checksum: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'running', 'completed', 'failed', 'rolled_back'],
    default: 'pending'
  },
  error: String,
  executionTime: Number
});

const Migration = mongoose.model('Migration', migrationSchema);

class MigrationRunner {
  constructor() {
    this.migrationsPath = path.join(__dirname, 'migrations');
  }

  // Get all migration files
  async getMigrationFiles() {
    const files = await fs.readdir(this.migrationsPath);
    return files
      .filter(f => f.endsWith('.js'))
      .sort(); // Ensure migrations run in order
  }

  // Calculate checksum for migration file
  async getChecksum(filePath) {
    const crypto = require('crypto');
    const content = await fs.readFile(filePath, 'utf8');
    return crypto.createHash('md5').update(content).digest('hex');
  }

  // Run pending migrations
  async up() {
    logger.info('Running database migrations...');
    
    const files = await this.getMigrationFiles();
    const appliedMigrations = await Migration.find({ status: 'completed' });
    const appliedNames = new Set(appliedMigrations.map(m => m.name));
    
    let ranMigrations = 0;
    
    for (const file of files) {
      const name = path.basename(file, '.js');
      
      if (appliedNames.has(name)) {
        // Check if migration file has changed
        const migration = appliedMigrations.find(m => m.name === name);
        const currentChecksum = await this.getChecksum(path.join(this.migrationsPath, file));
        
        if (migration.checksum !== currentChecksum) {
          throw new Error(`Migration ${name} has been modified after being applied!`);
        }
        
        continue;
      }
      
      await this.runMigration(file);
      ranMigrations++;
    }
    
    if (ranMigrations === 0) {
      logger.info('No pending migrations');
    } else {
      logger.info(`Successfully ran ${ranMigrations} migrations`);
    }
  }

  // Run a single migration
  async runMigration(file) {
    const name = path.basename(file, '.js');
    const filePath = path.join(this.migrationsPath, file);
    
    logger.info(`Running migration: ${name}`);
    
    // Create migration record
    const migration = new Migration({
      name,
      version: parseInt(name.split('_')[0]) || 0,
      checksum: await this.getChecksum(filePath),
      status: 'running'
    });
    
    await migration.save();
    
    const startTime = Date.now();
    
    try {
      // Load and run migration
      const migrationModule = require(filePath);
      
      // Start transaction
      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        await migrationModule.up(mongoose, session);
      });
      
      // Update migration record
      migration.status = 'completed';
      migration.executionTime = Date.now() - startTime;
      await migration.save();
      
      logger.info(`Migration ${name} completed in ${migration.executionTime}ms`);
      
    } catch (error) {
      // Record failure
      migration.status = 'failed';
      migration.error = error.message;
      migration.executionTime = Date.now() - startTime;
      await migration.save();
      
      logger.error(`Migration ${name} failed:`, error);
      throw error;
    }
  }

  // Rollback last migration
  async down() {
    const lastMigration = await Migration.findOne({ status: 'completed' })
      .sort({ appliedAt: -1 });
    
    if (!lastMigration) {
      logger.info('No migrations to rollback');
      return;
    }
    
    logger.info(`Rolling back migration: ${lastMigration.name}`);
    
    const filePath = path.join(this.migrationsPath, `${lastMigration.name}.js`);
    const migrationModule = require(filePath);
    
    if (!migrationModule.down) {
      throw new Error(`Migration ${lastMigration.name} does not support rollback`);
    }
    
    const startTime = Date.now();
    
    try {
      // Start transaction
      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        await migrationModule.down(mongoose, session);
      });
      
      // Update migration record
      lastMigration.status = 'rolled_back';
      await lastMigration.save();
      
      const executionTime = Date.now() - startTime;
      logger.info(`Rollback completed in ${executionTime}ms`);
      
    } catch (error) {
      logger.error(`Rollback failed:`, error);
      throw error;
    }
  }

  // Check migration status
  async status() {
    const migrations = await Migration.find().sort({ version: 1 });
    const files = await this.getMigrationFiles();
    
    console.log('\nMigration Status:');
    console.log('=================\n');
    
    for (const file of files) {
      const name = path.basename(file, '.js');
      const migration = migrations.find(m => m.name === name);
      
      if (migration) {
        const status = migration.status === 'completed' ? '✓' : '✗';
        console.log(`${status} ${name} (${migration.status}) - Applied: ${migration.appliedAt}`);
      } else {
        console.log(`  ${name} (pending)`);
      }
    }
    
    console.log('');
  }
}

module.exports = new MigrationRunner();