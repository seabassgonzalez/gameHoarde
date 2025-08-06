const webpack = require('webpack');

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
    "assert": false,
    "path": false,
    "os": false,
    "fs": false,
    "net": false,
    "tls": false,
    "child_process": false
  };

  // Add plugin to ignore node modules
  config.plugins = [
    ...config.plugins,
    new webpack.IgnorePlugin({
      resourceRegExp: /^(http|https|stream|util|zlib|url|crypto|assert)$/,
    }),
  ];

  // Force axios to use XMLHttpRequest
  config.resolve.alias = {
    ...config.resolve.alias,
    'axios/lib/adapters/http': false,
  };
  
  return config;
};