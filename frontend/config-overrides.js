module.exports = function override(config, env) {
  // Fix for axios trying to use node modules in browser
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "http": false,
    "https": false,
    "stream": false,
    "util": false,
    "zlib": false,
    "url": false,
    "crypto": false,
    "assert": false
  };
  
  return config;
};