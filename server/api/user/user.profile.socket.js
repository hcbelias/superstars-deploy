'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProfileLockManager = getProfileLockManager;
exports.register = register;

var _userProfile = require('./user.profile.lockmanager');

var _userProfile2 = _interopRequireDefault(_userProfile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var profileLockManagerSingleton = void 0;

function getProfileLockManager() {
  profileLockManagerSingleton = profileLockManagerSingleton || new _userProfile2.default();
  return profileLockManagerSingleton;
}

function register(socket) {
  var profileLockManager = getProfileLockManager();

  socket.on('profile:edit', function (profileId) {
    profileId = parseInt(profileId);
    profileLockManager.join(socket, profileId);

    socket.broadcast.emit('profile:lock:debug', 'socket ' + socket.id + ' is editing profile ' + profileId);
  });

  socket.on('profile:lock:list', function () {
    profileLockManager.sendLockList(socket);
  });

  socket.on('profile:lock:acquire', function (lockName) {
    profileLockManager.acquireLock(socket, lockName);
  });

  socket.on('profile:lock:release', function (lockName) {
    profileLockManager.releaseLock(socket, lockName);
  });
}
//# sourceMappingURL=../../api/user/user.profile.socket.js.map