'use strict';

// Test specific configuration
// ===========================

module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/superstars-test'
  },
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'test.sqlite',
      define: {
        timestamps: false
      }
    }
  },
  ssoUrl: 'http://sso.avenuecode.io/api/app/ac-superstars-local/loginByToken'
};
//# sourceMappingURL=../../config/environment/test.js.map