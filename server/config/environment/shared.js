'use strict';

exports = module.exports = {
  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  socialMedia: {
    twitterUrl: 'http://www.twitter.com/',
    facebookUrl: 'http://www.facebook.com/',
    linkedInUrl: 'http://www.linkedin.com/in/'
  },

  I18N: { // I18N - Exported to client side
    en: {
      "error-message-invalid-account": "You don't have a valid account to access the system. Please use an AvenueCode account.",
      "help": "Help",
      "myprofile": "My Profile",
      "profile": "Profile",
      "searchBoxTex": "Search for people, skills, positions, clients, projects and more"
    }
  },
  cookies: {
    'error-login': 'error-message-invalid-account'
  }

};
//# sourceMappingURL=../../config/environment/shared.js.map