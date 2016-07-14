'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'superstars-secret'
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  google: {
    clientID: process.env.GOOGLE_ID || '223526487816-dr94mhnc90652cvm2fl00i892gctjppk.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'JyJ2b8eGhrnJbPwmXj4pB6iN',
    callbackURL: (process.env.DOMAIN || '') + '/auth/google/callback'
  },

  profile: {
    proxyPictureRequest: !!process.env.PROFILE_PROXY_PICTURE_REQUEST,
    proxyPictureUrl: process.env.PROFILE_PROXY_PICTURE_URL || '/images/profile/{host}/{imagePath}?{querystring}'
  },

  domain: 'avenuecode.com'
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(all, require('./shared'), require('./' + process.env.NODE_ENV + '.js') || {});
//# sourceMappingURL=../../config/environment/index.js.map