'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = require('bluebird');


var authTypes = ['github', 'twitter', 'facebook', 'google'];

var UserSchema = new _mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  username: {
    type: String,
    unique: 'Username should be unique',
    required: 'Please fill in a username',
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  city: {
    type: String,
    trim: true
  },
  currentPosition: {
    type: String,
    trim: true
  },
  currentLocation: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  external_id: {
    type: String
  },
  social: {
    type: {
      skype: String,
      facebook: String,
      linkedIn: String,
      twitter: String
    },
    default: {}
  },
  provider: String,
  salt: String,
  google: {},
  currentClient: {
    type: String
  },
  currentProject: {
    type: String
  },
  hobbies: {
    type: [String],
    default: []
  },
  experiences: {
    type: [{
      position: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      project: String,
      client: String,
      startDate: {
        type: Date,
        required: true
      },
      skills: {
        type: Array,
        default: []
      },
      endDate: Date,
      isCurrentPosition: Boolean,
      activityDescription: String
    }],
    default: []
  },
  skillsCloud: {
    type: [{
      skill: {
        type: String,
        required: 'Skill Name is a required field.'
      },
      experienceYears: Number,
      selfGrade: Number
    }],
    default: []
  },
  profileComplete: {
    type: Boolean,
    default: false
  },
  aboutMe: {
    type: String
  },
  summaryOfQualification: {
    type: String
  },
  education: {
    type: [{
      school: {
        type: String,
        required: 'School Name is a required field.'
      },
      degree: {
        type: String,
        required: 'Degree is a required field.'
      },
      field: {
        type: String,
        required: 'Field is a required field.'
      },
      activities: String,
      startDate: {
        type: Date,
        required: 'Start Date is a required field.'
      },
      endDate: Date
    }],
    default: []
  },
  certifications: {
    type: [{
      name: {
        type: String,
        required: 'Certification Name is a required field.'
      },
      authority: {
        type: String,
        required: 'Certification Authority is a required field.'
      },
      startDate: Date,
      endDate: Date
    }]
  },
  languageSkills: {
    type: [{
      name: {
        type: String,
        required: 'Language is a required field.'
      },
      level: Number
    }],
    default: []
  }
}, {
  toJSON: {
    virtuals: true
  }
});

/**
 * Virtuals
 */

// Public profile information
UserSchema.virtual('profile').get(function () {
  return {
    'name': this.name,
    'role': this.role,
    'email': this.email,
    'position': this.currentPosition,
    'location': this.currentLocation,
    'social': this.social,
    'picture': this.getProfilePicture(),
    'isProfileComplete': this.profileComplete,
    'username': this.username

  };
});

UserSchema.virtual('completeProfile').get(function () {
  return {
    'name': this.name,
    'role': this.role,
    'email': this.email,
    'username': this.username,
    'position': this.currentPosition,
    'location': this.currentLocation,
    'social': this.social,
    'picture': this.getProfilePicture(),
    'languageSkills': this.languageSkills,
    'certifications': this.certifications,
    'education': this.education,
    'summaryOfQualification': this.summaryOfQualification,
    'aboutMe': this.aboutMe,
    'skillsCloud': this.skillsCloud,
    'experiences': this.experiences,
    'hobbies': this.hobbies
  };
});

// Non-sensitive info we'll be putting in the token
UserSchema.virtual('token').get(function () {
  return {
    '_id': this._id,
    'role': this.role
  };
});

/**
 * Validations
 */

// Validate empty email
UserSchema.path('email').validate(function (email) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return email.length;
}, 'Email cannot be blank');

var validatePresenceOf = function validatePresenceOf(value) {
  return value && value.length;
};

/**
 * Methods
 */
UserSchema.methods = {

  /**
   * Convert a Google picture url to a local one if `proxyPictureRequest` is set to TRUE.
   *   Google Url: https://lh6.googleusercontent.com/-cDUEyHTb5Pk/AAAAAAAAAAI/AAAAAAAAAEA/6vTpsC0MmC4/photo.jpg?sz=50
   *   Local Url: /images/profile/lh6/-cDUEyHTb5Pk/AAAAAAAAAAI/AAAAAAAAAEA/6vTpsC0MmC4/photo.jpg?sz=200
   *
   * @return {String}
   * @api public
   */
  getProfilePicture: function getProfilePicture() {
    var googleData = this.google || {},
        googleImage = googleData.image || {},
        profilePicture = googleImage.url || '',
        imagePathRegex = /^https?\:\/\/([^\.]+)\.googleusercontent\.com\/([^\?]+)(\?(.*))?$/;

    // Updating the 'sz' (size) parameter to 80 (default: sz=50)
    profilePicture = profilePicture.replace(/sz\=\d+/, 'sz=80');

    if (_environment2.default.profile.proxyPictureRequest && imagePathRegex.test(profilePicture)) {
      var imagePathMatch = profilePicture.match(imagePathRegex);

      profilePicture = _environment2.default.profile.proxyPictureUrl.replace('{host}', imagePathMatch[1]).replace('{imagePath}', imagePathMatch[2]).replace('{querystring}', imagePathMatch[4] || '');
    }

    return profilePicture;
  }
};

exports.default = _mongoose2.default.model('User', UserSchema);
//# sourceMappingURL=../../api/user/user.model.js.map