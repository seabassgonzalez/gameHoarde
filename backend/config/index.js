const dotenv = require('dotenv');
const path = require('path');

// Load environment-specific .env file
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env';

dotenv.config({ path: path.join(__dirname, '..', envFile) });

// Configuration validation
const requiredEnvVars = [
  'JWT_SECRET',
  'MONGODB_URI'
];

// Validate required environment variables
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Configuration object
const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  
  // Database
  database: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
      serverSelectionTimeoutMS: 5000,
    }
  },
  
  // Authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  },
  
  // External APIs
  apis: {
    rawg: {
      apiKey: process.env.RAWG_API_KEY,
      baseUrl: 'https://api.rawg.io/api',
      timeout: 30000,
    }
  },
  
  // Redis
  redis: {
    url: process.env.REDIS_URL,
    ttl: {
      default: 3600, // 1 hour
      gameData: 86400, // 24 hours
      userSession: 604800, // 7 days
    }
  },
  
  // Monitoring
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    logLevel: process.env.LOG_LEVEL || 'info',
  },
  
  // Security
  security: {
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    rateLimits: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    }
  },
  
  // File uploads
  uploads: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  }
};

module.exports = config;