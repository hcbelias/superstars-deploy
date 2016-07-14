'use strict';

var _express = require('express');

var _user = require('../user/user.controller');

var controller = _interopRequireWildcard(_user);

var _auth = require('../../auth/auth.service');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = new _express.Router();

router.get('/', controller.index);
router.get('/skill', controller.searchBySkill);
router.get('/:username', controller.show);

module.exports = router;
//# sourceMappingURL=../../api/public/index.js.map