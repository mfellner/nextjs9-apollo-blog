const path = require('path');

module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias['@blog/schema'] = path.resolve(__dirname, 'lib/schema.ts');
    } else {
      config.resolve.alias['@blog/schema'] = path.resolve(__dirname, 'empty.js');
    }
    return config;
  }
};
