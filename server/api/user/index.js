'use strict';

var _express = require('express');

var _user = require('./user.controller');

var controller = _interopRequireWildcard(_user);

var _auth = require('../../auth/auth.service');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = new _express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/skill', auth.isAuthenticated(), controller.searchBySkill);
router.get('/:username', auth.isAuthenticated(), controller.show);
router.put('/', auth.isAuthenticated(), controller.update);

module.exports = router;
//# sourceMappingURL=../../api/user/index.js.map