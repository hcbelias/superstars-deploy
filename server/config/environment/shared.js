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
    'invalidAccount': 'error-message-invalid-account',
    'emptyReminder': 'first-access-main-page'
  },
  languageLevels: {
    1: 'Elementary Proficiency',
    2: 'Limited Proficiency',
    3: 'Professional Proficiency',
    4: 'Full Professional Proficiency',
    5: 'Native or Bilingual Proficiency'
  }

};
//# sourceMappingURL=../../config/environment/shared.js.map