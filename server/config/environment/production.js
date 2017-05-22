'use strict';

// Production specific configuration
// =================================

module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP || process.env.IP || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080,

<<<<<<< HEAD
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://192.168.1.2:27017/superstars-staging'
  },
  ssoUrl: process.env.SSO_URI || 'http://sso.avenuecode.com/api/ac-superstars/loginByToken'
=======
        // MongoDB connection options
        mongo: {
                uri: process.env.MONGOLAB_URI || 'mongodb://localhost/superstars'
        },
        ssoUrl: process.env.SSO_URI || 'http://sso.avenuecode.com/api/ac-superstars/loginByToken'
>>>>>>> bc91ee08e9e6517c8560ea071542bc2cbedb4f7e
};
//# sourceMappingURL=../../config/environment/production.js.map