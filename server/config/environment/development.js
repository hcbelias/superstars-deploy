'use strict';

// Development specific configuration
// ==================================

module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://192.168.1.2:27017/superstars-staging'
  },
  ssoUrl: process.env.SSO_URI || 'http://sso.avenuecode.com/api/ac-superstars/loginByToken'

};
//# sourceMappingURL=../../config/environment/development.js.map