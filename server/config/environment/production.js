'use strict';

// Production specific configuration
// =================================

module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP || process.env.IP || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080,

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGOLAB_URI || 'mongodb://localhost/superstars'
  },
  ssoUrl: 'http://sso.avenuecode.io/api/app/ac-superstars/loginByToken'
};
//# sourceMappingURL=../../config/environment/production.js.map