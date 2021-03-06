/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/skills              ->  index
 * POST    /api/skills              ->  create
 * GET     /api/skills/:id          ->  show
 * PUT     /api/skills/:id          ->  update
 * DELETE  /api/skills/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _skill = require('./skill.model');

var _skill2 = _interopRequireDefault(_skill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return res.status(404).end();
  };
}

function saveUpdates(updates) {
  return function (entity) {
    var updated = _lodash2.default.merge(entity, updates);
    return updated.save().then(function (updated) {
      return updated;
    });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove().then(function () {
        return res.status(204).end();
      });
    }
    return res.status(404).end();
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      return res.status(404).end();
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    return res.status(statusCode).send(err);
  };
}

// Gets a list of Skills
function index(req, res) {
  return _skill2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Skill from the DB
function show(req, res) {
  return _skill2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new Skill in the DB
function create(req, res) {
  return _skill2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Updates an existing Skill in the DB
function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _skill2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Skill from the DB
function destroy(req, res) {
  return _skill2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=../../api/skill/skill.controller.js.map