'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.getChartTotalPerSkill = getChartTotalPerSkill;
exports.getChartExperiencePerSkill = getChartExperiencePerSkill;

var _user = require('../user/user.model');

var _user2 = _interopRequireDefault(_user);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getBenchFilter(onlyBench) {
  return onlyBench ? { $match: (0, _defineProperty3.default)({ onBench: { $exists: true } }, 'onBench', true) } : { $match: {} };
}

function getSkillsFilter(skills) {
  if (!skills) {
    return { $match: {} };
  } else if (skills.constructor === String) {
    return { $match: { 'skillsCloud.name': skills } };
  } else if (skills.length === 0) {
    return { $match: {} };
  } else {
    return { $match: { 'skillsCloud.name': { $in: skills } } };
  }
}

function queryReport(onlyBench, skills, group) {
  var benchFilter = getBenchFilter(onlyBench);

  var unwind = {
    $unwind: "$skillsCloud"
  };
  var skillsFilter = getSkillsFilter(skills);

  var project = {
    $project: { username: 1, skillsCloud: 1, _id: 0 }
  };

  var query = [benchFilter, unwind, skillsFilter, project, group];
  return _user2.default.aggregate(query).exec();
}

function respondData(res) {
  return function (data) {
    return res.status(202).json(data);
  };
}

function getChartTotalPerSkill(req, res) {
  var onlyBench = req.query.onlyBench && req.query.onlyBench === 'true' || false;
  var skills = req.query.skills || [];
  var group = {
    $group: {
      _id: '$skillsCloud.name',
      users: { $addToSet: "$username" }
    }
  };
  return queryReport(onlyBench, skills, group).then(respondData(res));
}

function getChartExperiencePerSkill(req, res) {
  var onlyBench = req.query.onlyBench && req.query.onlyBench === 'true' || false;
  var skills = req.query.skills || [];
  var group = {
    $group: {
      _id: { name: '$skillsCloud.name', exp: '$skillsCloud.experienceYears' },
      users: { $addToSet: { user: '$username' } }
    }
  };
  return queryReport(onlyBench, skills, group).then(respondData(res));
}
//# sourceMappingURL=../../api/chart/chart.controller.js.map