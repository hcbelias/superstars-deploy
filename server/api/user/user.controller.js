'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.index = index;
exports.show = show;
exports.update = update;
exports.me = me;
exports.searchBySkill = searchBySkill;
exports.updateSkill = updateSkill;
exports.deleteSkill = deleteSkill;
exports.createSkill = createSkill;
exports.updateLanguage = updateLanguage;
exports.deleteLanguage = deleteLanguage;
exports.createLanguage = createLanguage;
exports.updateExperience = updateExperience;
exports.deleteExperience = deleteExperience;
exports.createExperience = createExperience;
exports.updateEducation = updateEducation;
exports.deleteEducation = deleteEducation;
exports.createEducation = createEducation;
exports.updateCertification = updateCertification;
exports.deleteCertification = deleteCertification;
exports.createCertification = createCertification;
exports.deleteHobby = deleteHobby;
exports.createHobby = createHobby;
exports.updateAboutMe = updateAboutMe;
exports.updateSummary = updateSummary;
exports.updateFacebook = updateFacebook;
exports.updateTwitter = updateTwitter;
exports.updateLinkedin = updateLinkedin;
exports.updateSkype = updateSkype;
exports.authCallback = authCallback;

var _user = require('./user.model');

var _user2 = _interopRequireDefault(_user);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Mongo = require('mongodb');

var userWithPropertyNotFoundMsg = 'User with this property not found';
var userNotFoundMsg = 'User not found';

// User Model properties
var skillProperty = 'skillsCloud';
var experienceProperty = 'experiences';
var languageProperty = 'languageSkills';
var hobbyProperty = 'hobbies';
var educationProperty = 'education';
var certificationProperty = 'certifications';
var aboutMeProperty = 'aboutMe';
var summaryOfQualificationProperty = 'summaryOfQualification';
var facebookContactProperty = 'facebook';
var twitterContactProperty = 'twitter';
var skypeContactProperty = 'skype';
var linkedinContactProperty = 'linkedIn';

function findUserByUsername(username) {
  return _user2.default.findOne({ username: username }).exec();
}

function respondWithBasicProfileResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (!entity) return res.status(404).end();

    return res.status(statusCode).json(entity.profile);
  };
}

function respondWithBasicProfileResultList(res, statusCode) {
  var results = [];
  statusCode = statusCode || 200;
  return function (users) {
    if (!users) return res.status(200).json(results);

    for (var i = 0; i < users.length; i++) {
      results.push(users[i].profile);
    }
    return res.status(200).json(results);
  };
}

function respondWithCompleteProfileResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (!entity) {
      return res.status(404).end();
    }

    sortResults(entity.completeProfile.education, 'startDate', false);
    sortResults(entity.completeProfile.experiences, 'startDate', false);
    sortResults(entity.completeProfile.certifications, 'startDate', false);

    return res.status(statusCode).json(entity.completeProfile);
  };
}

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    return res.status(statusCode).json(getErrorObject(err));
  };
}

function handleUserNotFound(res) {
  return function (entity) {
    if (!entity) {
      return res.status(404).end(getErrorObject(userNotFoundMsg));
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    return res.status(statusCode).send(getErrorObject(err));
  };
}

function addQuerySearchSkill(queryTerms, searchRegExp) {
  queryTerms.push({
    skillsCloud: {
      $elemMatch: {
        skill: {
          $regex: searchRegExp
        }
      }
    }
  });
}

function getQuerySearchSkill(querystring) {
  var query = {},
      searchTerms = void 0,
      queryTerms = [],
      searchRegExp = void 0;

  //Check if there are query strings
  if ((0, _keys2.default)(querystring).length !== 0) {
    searchTerms = querystring.q.split(' ');
    for (var i = 0; i < searchTerms.length; i++) {
      searchRegExp = new RegExp('.*' + searchTerms[i] + '.*', 'i');
      addQuerySearchSkill(queryTerms, searchRegExp);
    }
    query = { $or: queryTerms };
  } else {
    query = null;
  }
  return query;
}

function getQuerySearchAllFields(querystring) {
  var query = {},
      searchTerms = void 0,
      queryTerms = [],
      searchRegExp = void 0;

  //Check if there are query strings
  if ((0, _keys2.default)(querystring).length !== 0) {
    searchTerms = querystring.q.split(' ');
    for (var i = 0; i < searchTerms.length; i++) {
      searchRegExp = new RegExp('.*' + searchTerms[i] + '.*', 'i');
      addQuerySearchSkill(queryTerms, searchRegExp);
      queryTerms.push({
        name: {
          $regex: searchRegExp
        }
      }, {
        currentPosition: {
          $regex: searchRegExp
        }
      }, {
        currentClient: {
          $regex: searchRegExp
        }
      }, {
        currentProject: {
          $regex: searchRegExp
        }
      }, {
        experiences: {
          $elemMatch: {
            client: {
              $regex: searchRegExp
            }
          }
        }
      }, {
        experiences: {
          $elemMatch: {
            project: {
              $regex: searchRegExp
            }
          }
        }
      });
    }
    query = { $or: queryTerms };
  }
  return query;
}

/**
 * Get list of users
 * restriction: 'admin'
 */
function index(req, res) {
  var query = getQuerySearchAllFields(req.query),
      results = [];

  return _user2.default.find().or(query).exec().then(respondWithBasicProfileResultList(res)).catch(handleError(res));
}

/**
 * Get a single user
 */
function show(req, res, next) {
  var username = req.params.username;

  return findUserByUsername(username).then(respondWithCompleteProfileResult(res)).catch(function (err) {
    return next(err);
  });
}

/**
 * Get a single user
 */
function update(req, res, next) {
  var username = req.body.username;

  return _user2.default.findOneAndUpdate({ username: username }, req.body, { new: true }).exec().then(respondWithCompleteProfileResult(res)).catch(function (err) {
    return next(err);
  });
}

/**
 * Get my info
 */
function me(req, res, next) {
  var userId = req.user._id;
  return _user2.default.findOne({ _id: userId }).exec().then(respondWithBasicProfileResult(res)).catch(function (err) {
    return next(err);
  });
}

/**
* Search user by skill
*/
function searchBySkill(req, res, next) {
  var query = getQuerySearchSkill(req.query);
  if (!query) {
    return res.status(200).json([]); // if none skill is passed, we dont return users
  }
  console.log((0, _stringify2.default)(query));
  return _user2.default.find(query).exec().then(respondWithBasicProfileResultList(res)).catch(handleError(res));
}

//  NEW ENDPOINTS AND AUX FUNCTIONS

function getErrorObject(error) {
  return { "error": error };
}

function findUserPropertyAndUpdateByUserProperty(req, res, action, propertyName) {
  var username = req.params.username;
  var propertyId = req.body._id;
  var propertyValue = req.body;
  return findUserByUsername(username).then(handleUserNotFound(res)).then(action(res, propertyName, propertyId, propertyValue)).catch(handleError(res));
}

function findUserAndCreateUserProperty(req, res, propertyName) {
  var username = req.params.username;
  return findUserByUsername(username).then(handleUserNotFound(res)).then(createUserProperty(res, propertyName, req.body)).catch(handleError(res));
}

function saveEntity(res, entity, returnValue, code) {
  code = code || 200;
  return entity.save(function (err, doc) {
    if (err) return handleError(err);
    return res.status(code).json(returnValue);
  });
}

function updateUserProperty(res, propertyName, propertyId, propertyValue) {
  return function (entity) {
    var property = entity[propertyName].id(propertyId);
    if (!property) {
      return res.status(404).json(getErrorObject(userWithPropertyNotFoundMsg));
    }
    var index = entity[propertyName].indexOf(property);
    entity[propertyName].set(index, propertyValue); //embebbed array must use set
    return saveEntity(res, entity, entity[propertyName][index]);
  };
}

function deleteUserProperty(res, propertyName, propertyId, propertyValue) {
  return function (entity) {
    var property = entity[propertyName].id(propertyId);
    if (!property) {
      return res.status(404).json(getErrorObject(userWithPropertyNotFoundMsg));
    }
    property.remove();
    return saveEntity(res, entity, {}, 204);
  };
}

function createUserProperty(res, propertyName, propertyValue) {
  return function (entity) {
    var property = entity[propertyName];
    property.push(propertyValue);
    console.log(propertyValue);
    return saveEntity(res, entity, property[property.length - 1]);
  };
}

// SKILL

function updateSkill(req, res, next) {
  return findUserPropertyAndUpdateByUserProperty(req, res, updateUserProperty, skillProperty);
}

function deleteSkill(req, res, next) {
  return findUserPropertyAndUpdateByUserProperty(req, res, deleteUserProperty, skillProperty);
}

function createSkill(req, res, next) {
  return findUserAndCreateUserProperty(req, res, skillProperty);
}

// Language
function updateLanguage(req, res, next) {
  return findUserPropertyAndUpdateByUserProperty(req, res, updateUserProperty, languageProperty);
}

function deleteLanguage(req, res, next) {
  return findUserPropertyAndUpdateByUserProperty(req, res, deleteUserProperty, languageProperty);
}

function createLanguage(req, res, next) {
  return findUserAndCreateUserProperty(req, res, languageProperty);
}

// Experience
function updateExperience(req, res, next) {
  return findUserPropertyAndUpdateByUserProperty(req, res, updateUserProperty, experienceProperty);
}

function deleteExperience(req, res, next) {
  return findUserPropertyAndUpdateByUserProperty(req, res, deleteUserProperty, experienceProperty);
}

function createExperience(req, res, next) {
  return findUserAndCreateUserProperty(req, res, experienceProperty);
}

// Education
function updateEducation(req, res, next) {
  return findUserPropertyAndUpdateByUserProperty(req, res, updateUserProperty, educationProperty);
}

function deleteEducation(req, res, next) {
  return findUserPropertyAndUpdateByUserProperty(req, res, deleteUserProperty, educationProperty);
}

function createEducation(req, res, next) {
  return findUserAndCreateUserProperty(req, res, educationProperty);
}

// Certification
function updateCertification(req, res, next) {
  return findUserPropertyAndUpdateByUserProperty(req, res, updateUserProperty, certificationProperty);
}

function deleteCertification(req, res, next) {
  return findUserPropertyAndUpdateByUserProperty(req, res, deleteUserProperty, certificationProperty);
}

function createCertification(req, res, next) {
  return findUserAndCreateUserProperty(req, res, certificationProperty);
}

// Hobby
function deleteHobby(req, res, next) {
  return findUserPropertyAndUpdateByUserProperty(req, res, deleteUserProperty, hobbyProperty);
}

function createHobby(req, res, next) {
  return findUserAndCreateUserProperty(req, res, hobbyProperty);
}

//Simple field
function updateSimpleField(res, propertyName, propertyValue) {
  return function (entity) {
    entity[propertyName] = propertyValue;
    return saveEntity(res, entity, { 'value': entity[propertyName] });
  };
}

function findUserAndUpdateProperty(req, res, action, propertyName) {
  var username = req.params.username;
  var propertyValue = req.body.value;
  console.log('Property Value - ' + propertyValue);
  return findUserByUsername(username).then(handleUserNotFound(res)).then(action(res, propertyName, propertyValue)).catch(handleError(res));
}

function updateAboutMe(req, res, next) {
  return findUserAndUpdateProperty(req, res, updateSimpleField, aboutMeProperty);
}

function updateSummary(req, res, next) {
  return findUserAndUpdateProperty(req, res, updateSimpleField, summaryOfQualificationProperty);
}

function updateFacebook(req, res, next) {
  return findUserAndUpdateProperty(req, res, updateSimpleField, facebookContactProperty);
}

function updateTwitter(req, res, next) {
  return findUserAndUpdateProperty(req, res, updateSimpleField, twitterContactProperty);
}

function updateLinkedin(req, res, next) {
  return findUserAndUpdateProperty(req, res, updateSimpleField, linkedinContactProperty);
}

function updateSkype(req, res, next) {
  return findUserAndUpdateProperty(req, res, updateSimpleField, skypeContactProperty);
}

/**
 * Authentication callback
 */
function authCallback(req, res, next) {
  res.redirect('/');
}

/**
* Sort an array of results
*/

function sortResults(arr, field, asc) {
  arr = arr.sort(function (el1, el2) {
    if (asc) {
      return el1[field] > el2[field] ? 1 : el1[field] < el2[field] ? -1 : 0;
    } else {
      return el2[field] > el1[field] ? 1 : el2[field] < el1[field] ? -1 : 0;
    }
  });
}
//# sourceMappingURL=../../api/user/user.controller.js.map