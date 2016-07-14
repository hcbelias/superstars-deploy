'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = setup;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportGoogleOauth = require('passport-google-oauth20');

var _errors = require('../../components/errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setup(User, config) {
  _passport2.default.use(new _passportGoogleOauth.Strategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
  }, function (accessToken, refreshToken, profile, done) {
    User.findOne({ 'google.id': profile.id }).exec().then(function (user) {

      if (config.domain !== profile.emails[0].value.split('@')[1]) {
        return done(null, false, { message: "error-message-invalid-account" });
      }

      if (user) {
        return done(null, user);
      }

      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        username: profile.emails[0].value.split('@')[0],
        provider: 'google',
        google: profile._json
      });
      user.save().then(function (user) {
        return done(null, user);
      }).catch(function (err) {
        return done(err);
      });
    }).catch(function (err) {
      return done(err);
    });
  }));
}
//# sourceMappingURL=../../auth/google/passport.js.map