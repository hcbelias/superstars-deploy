'use strict';

// Development specific configuration
// ==================================

module.exports = {

  mongo: {
    uri: process.env.MONGOLAB_URI || 'mongodb://localhost/superstars-staging'
  },
  ssoUrl: 'http://sso.avenuecode.io/api/ac-superstars/loginByToken'

};
//# sourceMappingURL=../../config/environment/staging.js.map