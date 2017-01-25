'use strict';

var _auth = require('../../auth/auth.service');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var express = require('express');
var controller = require('./skill.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.hasPermissionToAddEntity(), controller.create);
router.put('/:id', auth.hasPermissionToAddEntity(), controller.update);
router.patch('/:id', auth.hasPermissionToAddEntity(), controller.update);
router.delete('/:id', auth.hasPermissionToAddEntity(), controller.destroy);

module.exports = router;
//# sourceMappingURL=../../api/skill/index.js.map