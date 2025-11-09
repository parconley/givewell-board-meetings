const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configure for GitHub Pages deployment
if (process.env.NODE_ENV === 'production') {
  config.transformer = {
    ...config.transformer,
    publicPath: '/givewell-board-meetings/_expo/static/js/web',
  };
}

module.exports = config;
