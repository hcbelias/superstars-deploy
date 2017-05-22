'use strict';

// Development specific configuration
// ==================================

module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://192.168.1.2:27017/superstars-staging'
  },
<<<<<<< HEAD
  ssoUrl: process.env.SSO_URI || 'http://sso.avenuecode.com/api/ac-superstars/loginByToken'
=======
  ssoUrl: 'http://sso.avenuecode.io/api/ac-superstars/loginByToken'
>>>>>>> bc91ee08e9e6517c8560ea071542bc2cbedb4f7e

};
//# sourceMappingURL=../../config/environment/development.js.map