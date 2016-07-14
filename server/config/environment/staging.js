'use strict';

// Development specific configuration
// ==================================

module.exports = {

  mongo: {
    uri: process.env.MONGOLAB_URI || 'mongodb://localhost/superstars-staging'
  }

};
//# sourceMappingURL=../../config/environment/staging.js.map