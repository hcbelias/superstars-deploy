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

    return res.status(statusCode).json(entity.completeProfile);
  };
}

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    return res.status(statusCode).send(err);
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
      searchTerms,
      queryTerms = [],
      searchRegExp;

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
      searchTerms,
      queryTerms = [],
      searchRegExp;

  //Check if there are query strings
  if ((0, _keys2.default)(querystring).length !== 0) {
    searchTerms = querystring.q.split(' ');
    for (var i = 0; i < searchTerms.length; i++) {
      searchRegExp = new RegExp('.*' + searchTerms[i] + '.*', 'i');
      addQuerySearchSkill(queryTerms, searchRegExp);
      queryTerms.push({
        currentRole: {
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

  return _user2.default.findOne({ username: username }).exec().then(respondWithCompleteProfileResult(res)).catch(function (err) {
    return next(err);
  });
}

/**
 * Get a single user
 */
function update(req, res, next) {
  var username = req.params.username;

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

/**
 * Authentication callback
 */
function authCallback(req, res, next) {
  res.redirect('/');
}
//# sourceMappingURL=../../api/user/user.controller.js.map