'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProfileLockManager = function () {
  function ProfileLockManager(options) {
    (0, _classCallCheck3.default)(this, ProfileLockManager);

    options = options || {};

    this.profiles = {};
    this.sessions = {};
    this.maxAllowedLocks = options.maxAllowedLocks || 10;
    this.maxLockName = options.maxLockName || 50;
  }

  (0, _createClass3.default)(ProfileLockManager, [{
    key: 'getRoomName',
    value: function getRoomName(profileId) {
      return 'profile:edit:room:' + profileId;
    }
  }, {
    key: 'getProfile',
    value: function getProfile(profileId) {
      var profile = this.profiles[profileId];

      if (!profile) {
        profile = {
          lockCount: 0,
          locks: {}
        };

        if (profileId > 0) {
          this.profiles[profileId] = profile;
        }
      }

      return profile;
    }
  }, {
    key: 'createSession',
    value: function createSession(client, profileId) {
      this.sessions[client.id] = {
        clientId: client.id,
        profileId: profileId,
        lockCount: 0,
        locks: {}
      };

      return this.sessions[client.id];
    }
  }, {
    key: 'destroySession',
    value: function destroySession(client) {
      var session = this.sessions[client.id];

      if (!session) {
        return;
      }

      this.releaseClientLocks(client);
      delete this.sessions[client.id];
    }
  }, {
    key: 'join',
    value: function join(client, profileId) {
      var _this = this;

      var roomName = this.getRoomName(profileId),
          error = this.clientErrorEmitter(client);

      if (profileId <= 0) {
        return error('Invalid profile id (' + profileId + ')');
      }

      this.leave(client);

      client.join(roomName, function () {
        _this.createSession(client, profileId);
        _this.sendLockList(client, profileId);
      });

      this.attachDisconnectListener(client);
    }
  }, {
    key: 'leave',
    value: function leave(client) {
      var session = this.sessions[client.id],
          profileId = session ? session.profileId : 0,
          roomName = this.getRoomName(profileId);

      if (session) {
        client.leave(roomName);
      }

      this.destroySession(client);
    }
  }, {
    key: 'acquireLock',
    value: function acquireLock(client, lockName) {
      var session = this.sessions[client.id],
          profileId = session ? session.profileId : 0,
          profile = this.getProfile(profileId),
          error = this.clientErrorEmitter(client);

      if (!session) {
        return error('The session has not been started');
      }

      if (!lockName) {
        return error('Lock name is undefined');
      } else if (lockName.length > this.maxLockName) {
        return error('Lock name must not exceed ' + this.maxLockName + ' characters');
      }

      if (profile.locks[lockName]) {
        if (profile.locks[lockName].clientId !== client.id) {
          return error(lockName + ' has already been acquired by other client');
        }

        return true;
      } else {
        if (session.lockCount >= this.maxAllowedLocks) {
          return error('The client reached the maximum number of allowed locks (' + session.lockCount + ')');
        }

        profile.lockCount++;
        profile.locks[lockName] = {
          name: lockName,
          clientId: client.id
        };

        session.lockCount++;
        session.locks[lockName] = {
          name: lockName,
          time: new Date().getTime()
        };
      }

      this.notifyAcquiredLock(client, profileId, lockName);
      return true;
    }
  }, {
    key: 'releaseClientLocks',
    value: function releaseClientLocks(client) {
      var _this2 = this;

      var session = this.sessions[client.id],
          lockNames = session ? (0, _keys2.default)(session.locks) : [];

      if (!session) {
        return;
      }

      lockNames.forEach(function (lockName) {
        _this2.releaseLock(client, lockName);
      });
    }
  }, {
    key: 'releaseLock',
    value: function releaseLock(client, lockName) {
      var session = this.sessions[client.id],
          profileId = session ? session.profileId : 0,
          profile = this.getProfile(profileId),
          lock = profile.locks[lockName],
          error = this.clientErrorEmitter(client),
          warning = this.clientWarningEmitter(client);

      if (!session) {
        return error('The session has not been started for this client');
      }

      if (!lock) {
        return warning(lockName + ' does not exists');
      }

      if (lock.clientId !== client.id) {
        return error(lockName + ' has been acquired by other client ');
      }

      delete session.locks[lockName];
      session.lockCount--;

      delete profile.locks[lockName];
      profile.lockCount--;

      if (!profile.lockCount) {
        delete this.profiles[profileId];
      }

      this.notifyReleasedLock(client, profileId, lockName);
      return true;
    }
  }, {
    key: 'sendLockList',
    value: function sendLockList(client) {
      var session = this.sessions[client.id] || {},
          profile = this.profiles[session.profileId || 0] || {},
          locks = profile.locks || {};

      client.emit('profile:lock:list', locks);
    }
  }, {
    key: 'notifyAcquiredLock',
    value: function notifyAcquiredLock(client, profileId, lockName) {
      var room = this.getRoomName(profileId);

      client.broadcast.to(room).emit('profile:lock:acquired', {
        name: lockName
      });
    }
  }, {
    key: 'notifyReleasedLock',
    value: function notifyReleasedLock(client, profileId, lockName) {
      var room = this.getRoomName(profileId);

      client.broadcast.to(room).emit('profile:lock:released', {
        name: lockName
      });
    }
  }, {
    key: 'attachDisconnectListener',
    value: function attachDisconnectListener(client) {
      var _this3 = this;

      client.once('disconnect', function () {
        _this3.leave(client);
      });
    }
  }, {
    key: 'clientErrorEmitter',
    value: function clientErrorEmitter(client) {
      return function (message) {
        client.emit('profile:lock:error', message);
        return false;
      };
    }
  }, {
    key: 'clientWarningEmitter',
    value: function clientWarningEmitter(client) {
      return function (message) {
        client.emit('profile:lock:warning', message);
        return false;
      };
    }
  }]);
  return ProfileLockManager;
}();

exports.default = ProfileLockManager;
//# sourceMappingURL=../../api/user/user.profile.lockmanager.js.map