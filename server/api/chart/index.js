'use strict';

var _express = require('express');

var _chart = require('./chart.controller');

var controller = _interopRequireWildcard(_chart);

var _auth = require('../../auth/auth.service');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = new _express.Router();

router.get('/total-per-skill', auth.isAuthenticated(), controller.getChartTotalPerSkill);
router.get('/experience-per-skill', auth.isAuthenticated(), controller.getChartExperiencePerSkill);
module.exports = router;
//# sourceMappingURL=../../api/chart/index.js.map