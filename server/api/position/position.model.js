'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PositionSchema = new _mongoose2.default.Schema({
  name: String,
  active: Boolean
});

exports.default = _mongoose2.default.model('Position', PositionSchema);
//# sourceMappingURL=../../api/position/position.model.js.map