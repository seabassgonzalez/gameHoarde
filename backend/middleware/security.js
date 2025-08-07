const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Rate limiting configurations
const createAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many accounts created from this IP, please try again later'
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login attempts per windowMs
  message: 'Too many login attempts, please try again later'
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Security middleware setup
const setupSecurity = (app) => {
  // Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  // Prevent NoSQL injection attacks
  app.use(mongoSanitize());

  // General API rate limiting
  app.use('/api/', apiLimiter);

  return {
    createAccountLimiter,
    loginLimiter,
    apiLimiter
  };
};

module.exports = { setupSecurity, createAccountLimiter, loginLimiter };