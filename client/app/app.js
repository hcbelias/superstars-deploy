'use strict';

angular.module('superstarsApp', ['superstarsApp.auth', 'superstarsApp.constants', 'superstarsApp.screen', 'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io', 'ui.router', 'validation.match', 'ngMaterial', 'ngMessages', 'pascalprecht.translate', 'zInfiniteScroll', 'duScroll', 'chart.js']).config(function ($urlRouterProvider, $locationProvider, $translateProvider, $mdThemingProvider, appConfig) {
      $urlRouterProvider.otherwise('/');
      $urlRouterProvider.rule(function ($injector, $location) {

            var path = $location.path();
            var hasTrailingSlash = path[path.length - 1] === '/';

            if (hasTrailingSlash) {

                  //if last charcter is a slash, return the same url without the slash  
                  var newPath = path.substr(0, path.length - 1);
                  return newPath;
            }
      });

      $locationProvider.html5Mode(true);

      $translateProvider.useSanitizeValueStrategy('sanitize');
      $translateProvider.translations('en', appConfig.I18N.en);
      $translateProvider.preferredLanguage('en');

      $mdThemingProvider.theme('default').primaryPalette('blue').warnPalette('orange');
});
//# sourceMappingURL=../app/app.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* exported ProfileTimelineBaseController */

// TODO: This class is on global namespace (window) because we're
// gonna have to update the project structure to support modules on client

var ProfileTimelineBaseController = function () {
  function ProfileTimelineBaseController(idField, sortField, profileTileLockerId, ProfileTileLocker, $filter, Screen) {
    _classCallCheck(this, ProfileTimelineBaseController);

    this.items = this.items || [];
    this.idField = idField;
    this.sortField = sortField;
    this.profileTileLockerId = profileTileLockerId;
    this.ProfileTileLocker = ProfileTileLocker;
    this.$filter = $filter;
    this.Screen = Screen;
    this.sorted = false;
    this.itemInEditMode = null;
    this.locked = false;

    this.initTileLockListener();
  }

  _createClass(ProfileTimelineBaseController, [{
    key: 'initTileLockListener',
    value: function initTileLockListener() {
      var _this = this;

      this.tileLocker = this.ProfileTileLocker.subscribe(this.profileTileLockerId, function (locked) {
        _this.locked = locked;
      });
    }
  }, {
    key: '$onChanges',
    value: function $onChanges(changesObj) {
      var items = changesObj.items ? changesObj.items.currentValue : null;

      if (items && !this.sorted) {
        var sortedItems = this.$filter('orderBy')(items, this.sortField, true);
        angular.copy(sortedItems, items);
        this.sorted = true;
      }

      this.setItemInEditMode(null);
    }
  }, {
    key: 'getItemIndex',
    value: function getItemIndex(item) {
      return this.items.indexOf(item);
    }
  }, {
    key: 'addItem',
    value: function addItem() {
      var newItem = {};
      this.items && this.items.unshift(newItem);
      this.setItemInEditMode(newItem);
    }
  }, {
    key: 'editItem',
    value: function editItem(item) {
      if (!this.locked && !this.itemInEditMode) {
        this.setItemInEditMode(item);
      }
    }
  }, {
    key: 'updateItem',
    value: function updateItem() {
      this.setItemInEditMode(null);
    }
  }, {
    key: 'removeItem',
    value: function removeItem(item) {
      var index = this.items.indexOf(item);
      this.items.splice(index, 1);

      this.setItemInEditMode(null);
    }
  }, {
    key: 'cancelItem',
    value: function cancelItem(item) {
      var index;

      if (angular.equals(item, {})) {
        index = this.items.indexOf(item);
        this.items.splice(index, 1);
      }

      this.setItemInEditMode(null);
    }
  }, {
    key: 'setItemInEditMode',
    value: function setItemInEditMode(item) {
      this.itemInEditMode = item;

      if (item) {
        this.tileLocker.lock();
      } else {
        this.tileLocker.unlock();
      }
    }
  }, {
    key: 'isInEditMode',
    value: function isInEditMode() {
      return !!this.itemInEditMode;
    }
  }, {
    key: 'isEditing',
    value: function isEditing(item) {
      return this.itemInEditMode === item;
    }
  }, {
    key: 'isBlocked',
    value: function isBlocked(item) {
      return this.itemInEditMode && this.itemInEditMode !== item;
    }
  }, {
    key: '$onDestroy',
    value: function $onDestroy() {
      this.tileLocker.unsubscribe();
    }
  }]);

  return ProfileTimelineBaseController;
}();
//# sourceMappingURL=../../components/profile/profileTimelineBaseController.js.map
'use strict';

angular.module('superstarsApp.auth', ['superstarsApp.constants', 'superstarsApp.util', 'ngCookies', 'ui.router']).config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});
//# sourceMappingURL=../../components/auth/auth.module.js.map
'use strict';

angular.module('superstarsApp.screen', []);
//# sourceMappingURL=../../components/screen/screen.module.js.map
'use strict';

angular.module('superstarsApp.util', []);
//# sourceMappingURL=../../components/util/util.module.js.map
'use strict';

angular.module('superstarsApp').config(function ($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'app/account/login/login.html',
    controller: 'LoginController',
    controllerAs: 'vm'
  }).state('logout', {
    url: '/logout',
    template: '',
    controller: 'LogoutController',
    controllerAs: 'vm'
  });
}).run(function ($rootScope) {
  $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current) {
    if (next.name === 'logout' && current && current.name && !current.authenticate) {
      next.referrer = current.name;
    }
  });
});
//# sourceMappingURL=../../app/account/account.js.map
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginController = function LoginController(Auth, $state, $cookies, appConfig) {
  _classCallCheck(this, LoginController);

  if (Auth.isLoggedIn()) {
    $state.go('main');
  }
  $cookies.remove(appConfig.cookies.emptyReminder);
};

angular.module('superstarsApp').controller('LoginController', LoginController);
//# sourceMappingURL=../../../app/account/login/login.controller.js.map
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LogoutController = function LogoutController(Auth, $state) {
  _classCallCheck(this, LogoutController);

  Auth.logout();
  $state.go('login');
};

angular.module('superstarsApp').controller('LogoutController', LogoutController);
//# sourceMappingURL=../../../app/account/logout/logout.controller.js.map
"use strict";

(function (angular, undefined) {
	angular.module("superstarsApp.constants", []).constant("appConfig", {
		"userRoles": ["guest", "user", "admin"],
		"socialMedia": {
			"twitterUrl": "http://www.twitter.com/",
			"facebookUrl": "http://www.facebook.com/",
			"linkedInUrl": "http://www.linkedin.com/in/"
		},
		"I18N": {
			"en": {
				"error-message-invalid-account": "You don't have a valid account to access the system. Please use an AvenueCode account.",
				"help": "Help",
				"myprofile": "My Profile",
				"profile": "Profile",
				"searchBoxTex": "Search for people, skills, positions, clients, projects and more"
			}
		},
		"cookies": {
			"invalidAccount": "error-message-invalid-account",
			"emptyReminder": "first-access-main-page"
		},
		"languageLevels": {
			"1": "Elementary Proficiency",
			"2": "Limited Proficiency",
			"3": "Professional Proficiency",
			"4": "Full Professional Proficiency",
			"5": "Native or Bilingual Proficiency"
		}
	});
})(angular);
//# sourceMappingURL=../app/app.constant.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var CHART_TYPE_TOTAL = 'Developer per Skill';
  var CHART_TYPE_EXPERIENCE = 'Experience per skill';

  var ChartController = function () {
    function ChartController(Skill, Chart, User) {
      _classCallCheck(this, ChartController);

      this.SkillService = Skill;
      this.ChartService = Chart;
      this.UserService = User;

      this.chartTypes = [CHART_TYPE_TOTAL, CHART_TYPE_EXPERIENCE];

      this.selectedSkills = [];
      this.chartOptions = {
        'legend': {
          display: true
        },
        'scales': {
          'yAxes': [{
            'ticks': {
              'beginAtZero': true,
              'min': 0,
              'stepSize': 1
            }
          }]
        },
        'callback': this.getUserCards.bind(this)
      };
      this.selectedChart = CHART_TYPE_TOTAL;
      this.sort = true;
      this.topResults = true;
      this.bench = true;
      this.noResults = false;
      this.numberResults = 20;
    }

    _createClass(ChartController, [{
      key: '$onInit',
      value: function $onInit() {
        this.SkillService.getSkills({}, this.loadAvailableSkills.bind(this));
      }
    }, {
      key: 'loadAvailableSkills',
      value: function loadAvailableSkills(data) {
        this.items = data;
      }
    }, {
      key: 'querySearch',
      value: function querySearch(query) {
        var results = query ? this.items.filter(this.createFilterFor(query)) : this.items;
        return results;
      }
    }, {
      key: 'createFilterFor',
      value: function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(skill) {
          return angular.lowercase(skill.name).indexOf(lowercaseQuery) === 0;
        };
      }
    }, {
      key: 'selectUsers',
      value: function selectUsers() {
        if (arguments[2]) {
          var index = arguments[2]._index;
          var users = this.chart.options.info[index].users;
          this.chart.options.callback(users);
        }
      }
    }, {
      key: 'isChartPerTotal',
      value: function isChartPerTotal() {
        return this.selectedChart === CHART_TYPE_TOTAL;
      }
    }, {
      key: 'getUserCards',
      value: function getUserCards(users) {
        if (!this.isChartPerTotal()) {
          users = users.map(function (v) {
            return v.user;
          });
        }
        this.UserService.getUsers({ q: users }, this.loadUserCard.bind(this));
      }
    }, {
      key: 'loadUserCard',
      value: function loadUserCard(data) {
        this.userList = data;
      }
    }, {
      key: 'generateChart',
      value: function generateChart() {
        var endpoint = void 0;
        var callback = void 0;
        if (this.topResults && !this.numberResults) {
          return;
        }
        switch (this.selectedChart) {
          case CHART_TYPE_TOTAL:
            endpoint = this.ChartService.getTotalPerSkill;
            callback = this.loadReportTotalData.bind(this);
            break;
          case CHART_TYPE_EXPERIENCE:
            endpoint = this.ChartService.getExperiencePerSkill;
            callback = this.loadReportExperienceData.bind(this);
            break;
          default:
            return;
        }
        var skillList = this.selectedSkills.map(function (obj) {
          return obj.name;
        });
        this.userList = [];
        endpoint({ onlyBench: this.bench, skills: skillList }, callback);
      }
    }, {
      key: 'setReportData',
      value: function setReportData(reportData, legend) {
        this.chartOptions.legend.display = legend;
        this.noResults = reportData.length === 0;
        //updating options to send data through chart lib
        this.chartOptions.info = reportData;
      }
    }, {
      key: 'filterResult',
      value: function filterResult(reportData) {
        if (this.topResults) {
          reportData = reportData.slice(0, this.numberResults);
        }
        return reportData;
      }
    }, {
      key: 'loadReportTotalData',
      value: function loadReportTotalData(reportData) {
        var _this = this;

        //Sort
        reportData = reportData.sort(function (a, b) {
          return _this.sort ? b.users.length - a.users.length : a.users.length - b.users.length;
        });

        //Filter
        reportData = this.filterResult(reportData);

        //Build Report
        this.data = reportData.map(function (obj) {
          return obj.users.length;
        });
        this.labels = reportData.map(function (obj) {
          return obj._id;
        });

        //Set data
        this.setReportData(reportData, false);
      }
    }, {
      key: 'loadReportExperienceData',
      value: function loadReportExperienceData(reportData) {
        var years = [].concat(_toConsumableArray(new Set(reportData.map(function (obj) {
          return obj._id.exp;
        }))));
        var skills = [].concat(_toConsumableArray(new Set(reportData.map(function (obj) {
          return obj._id.name;
        }))));
        var filter = function filter(name) {
          return function (obj) {
            return obj._id.name === name;
          };
        };
        var data = [];
        for (var i = 0; i < skills.length; i++) {
          var skillArray = Array.from({ length: years.length }, function () {
            return 0;
          });
          var skillData = reportData.filter(filter(skills[i]));
          for (var j = 0; j < skillData.length; j++) {
            if (skillData[j]._id.exp > 15) {
              skillArray[15] += skillData[j].users.length;
            } else {
              skillArray[skillData[j]._id.exp] += skillData[j].users.length;
            }
          }
          data.push(skillArray);
        }
        //unique skills
        this.series = skills;
        this.labels = years.sort(function (a, b) {
          return a - b;
        });

        this.data = data;

        this.setReportData(reportData, true);
      }
    }]);

    return ChartController;
  }();

  angular.module('superstarsApp').component('chart', {
    templateUrl: 'app/chart/chart.html',
    controller: ChartController
  });
})();
//# sourceMappingURL=../../app/chart/chart.controller.js.map
'use strict';

angular.module('superstarsApp').config(function ($stateProvider) {
    $stateProvider.state('chart', {
        url: '/chart',
        template: '<chart layout="column" flex></profile>',
        authenticate: true
    });
});
//# sourceMappingURL=../../app/chart/chart.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var FIELD_NAME = 'isProfileComplete';

  var MainController = function () {
    function MainController(Auth, ProfileService, $cookies, appConfig, $state) {
      _classCallCheck(this, MainController);

      this.Auth = Auth;
      this.ProfileService = ProfileService;
      this.cookie = $cookies;
      this.config = appConfig;
      this.state = $state;
    }

    _createClass(MainController, [{
      key: '$onInit',
      value: function $onInit() {
        this.Auth.getCurrentUser(this.displayReminder.bind(this));
      }
    }, {
      key: 'displayReminder',
      value: function displayReminder(user) {
        var cookie = this.cookie.get(this.config.cookies.emptyReminder);
        if (user.hasOwnProperty(FIELD_NAME) && !user[FIELD_NAME] && !cookie) {
          this.user = user;
          this.cookie.put(this.config.cookies.emptyReminder, true);
          this.ProfileService.emptyProfileReminder(event, this.redirectToProfilePage.bind(this));
        }
      }
    }, {
      key: 'redirectToProfilePage',
      value: function redirectToProfilePage() {
        this.state.go('profile', { username: this.user.username });
      }
    }]);

    return MainController;
  }();

  angular.module('superstarsApp').component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });
})();
//# sourceMappingURL=../../app/main/main.controller.js.map
'use strict';

angular.module('superstarsApp').config(function ($stateProvider) {
  $stateProvider.state('main', {
    url: '/?q',
    template: '<main layout="column" flex></main>',
    authenticate: true
  });
});
//# sourceMappingURL=../../app/main/main.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var SUCCESS_MESSAGE = 'Profile updated.';
    var ERROR_MESSAGE = 'Sorry, we did something wrong. Please, contact Superstars team.';
    var PUBLIC_PROFILE_STATE_NAME = 'publicprofile';

    var ProfileController = function () {
        function ProfileController(User, $stateParams, $mdToast, Auth, $state, $cacheFactory, ProfileService) {
            _classCallCheck(this, ProfileController);

            this.User = User;
            this.StateParams = $stateParams;
            this.Auth = Auth;
            this.Toast = $mdToast;
            this.state = $state;
            this.hideSection = false;
            this.readOnly = true;
            this.cf = $cacheFactory;
            this.ProfileService = ProfileService;
        }

        _createClass(ProfileController, [{
            key: '$onInit',
            value: function $onInit() {
                this.Auth.hasPermissionToEdit(this.StateParams.username).then(this.setReadOnly.bind(this));
                this.User.getProfile({ username: this.StateParams.username }, this.loadData.bind(this), this.redirectToMainPageOnError.bind(this, this.StateParams.username));
                this.setHideSection(this.state);
            }
        }, {
            key: 'loadData',
            value: function loadData(data) {
                this.user = data;
            }
        }, {
            key: 'isPublicProfile',
            value: function isPublicProfile(state) {
                return state.current.name === PUBLIC_PROFILE_STATE_NAME;
            }
        }, {
            key: 'setHideSection',
            value: function setHideSection() {
                this.hideSection = this.isPublicProfile(this.state);
            }
        }, {
            key: 'setReadOnly',
            value: function setReadOnly(user) {
                var isAdmin = user.hasOwnProperty('role') ? this.Auth.compareRole(user.role, 'admin') : false;
                //ReadOnly - Public Profile or user is not admin and it is not his profile
                this.readOnly = this.isPublicProfile(this.state) || !isAdmin && this.StateParams.username !== user.username;
            }
        }, {
            key: 'updateNewPropertyId',
            value: function updateNewPropertyId(field) {
                var userData = this.user;
                var toast = this.Toast.show;
                var toastBuilder = this.Toast.simple;
                var buildToastFunc = this.buildToastMessage;

                return function (data) {
                    var index = userData[field].findIndex(function (item) {
                        return !item._id;
                    });
                    userData[field][index] = data.toJSON();
                    buildToastFunc(SUCCESS_MESSAGE, toast, toastBuilder);
                };
            }
        }, {
            key: 'showSuccessMessage',
            value: function showSuccessMessage() {
                return this.showMessage(SUCCESS_MESSAGE);
            }
        }, {
            key: 'showErrorMessage',
            value: function showErrorMessage() {
                return this.showMessage(ERROR_MESSAGE);
            }
        }, {
            key: 'redirectToMainPageOnError',
            value: function redirectToMainPageOnError(username, error) {
                if (error.status === 404) {
                    this.buildToastMessage('User not found: \'' + username + '\'.', this.Toast.show, this.Toast.simple);
                } else {
                    this.buildToastMessage(SUCCESS_MESSAGE, this.Toast.show, this.Toast.simple);
                }
                this.state.go('main');
            }
        }, {
            key: 'showMessage',
            value: function showMessage(message) {
                var toast = this.Toast.show;
                var toastBuilder = this.Toast.simple;
                var buildToastFunc = this.buildToastMessage;
                return function () {
                    return buildToastFunc(message, toast, toastBuilder);
                };
            }
        }, {
            key: 'buildToastMessage',
            value: function buildToastMessage(message, toast, toastBuilder) {
                toast(toastBuilder().textContent(message).position('bottom right'));
            }
        }, {
            key: 'updateSimpleField',
            value: function updateSimpleField(path, value) {
                this.User.updateProfile({ username: this.user.username, path: path, data: value }, this.showSuccessMessage(), this.showErrorMessage());
            }
        }, {
            key: 'updateComplexField',
            value: function updateComplexField(path, object) {
                this.User.updateProfile({ username: this.user.username, path: path, data: object, id: object._id }, this.showSuccessMessage(), this.showErrorMessage());
            }
        }, {
            key: 'save',
            value: function save(path, object, field) {
                this.User.saveProfile({ username: this.user.username, path: path, data: object }, this.updateNewPropertyId(field), this.showErrorMessage());
            }
        }, {
            key: 'delete',
            value: function _delete(path, id) {
                this.User.deleteProfile({ username: this.user.username, path: path, id: id }, this.showSuccessMessage(), this.showErrorMessage());
            }
        }, {
            key: 'deleteProfile',
            value: function deleteProfile() {
                if (this.Auth.isAdmin()) {
                    var that = this;
                    this.User.deleteWholeProfile({ username: this.user.username }, function () {
                        that.showSuccessMessage();
                        that.cf.get('$http').removeAll();
                        that.state.go('main');
                    }, this.showErrorMessage());
                } else {
                    this.ProfileService.help('Unauthorized', 'Only administrators are allowed to delete a profile.');
                }
            }
        }]);

        return ProfileController;
    }();

    angular.module('superstarsApp').component('profile', {
        templateUrl: 'app/profile/profile.html',
        controller: ProfileController
    });
})();
//# sourceMappingURL=../../app/profile/profile.controller.js.map
'use strict';

angular.module('superstarsApp').config(function ($stateProvider) {
  $stateProvider.state('profile', {
    url: '/profile/:username',
    template: '<profile layout="column" flex></profile>',
    authenticate: true
  }).state('publicprofile', {
    url: '/public/profile/:username',
    template: '<profile layout="column" flex></profile>',
    authenticate: false
  }).state('myprofile', {
    url: '/profile/me',
    template: '<profile layout="column" flex></profile>',
    authenticate: true
  }).state('exportprofile', {
    url: '/api/users/:username/resume-:to',
    template: '<profile layout="column" flex></profile>',
    authenticate: false
  });
});
//# sourceMappingURL=../../app/profile/profile.js.map
'use strict';

(function () {

  function AuthService($location, $http, $cookies, $q, appConfig, Util, User) {
    var safeCb = Util.safeCb;
    var currentUser = {};
    var userRoles = appConfig.userRoles || [];

    if ($cookies.get('token') && $location.path() !== '/logout') {
      currentUser = User.getMyUser();
    }

    var Auth = {
      logout: function logout() {
        $cookies.remove('token');
        $cookies.remove('ssotoken');
        currentUser = {};
      },


      /*
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional, function(error, user)
       * @return {Promise}
       */
      createUser: function createUser(user, callback) {
        return User.save(user, function (data) {
          $cookies.put('token', data.token);
          currentUser = User.getMyUser();
          return safeCb(callback)(null, user);
        }, function (err) {
          Auth.logout();
          return safeCb(callback)(err);
        }).$promise;
      },


      /*
       * Gets all available info on a user
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, funciton(user)
       * @return {Object|Promise}
       */
      getCurrentUser: function getCurrentUser(callback) {
        if (arguments.length === 0) {
          return currentUser;
        }

        var value = currentUser.hasOwnProperty('$promise') ? currentUser.$promise : currentUser;
        return $q.when(value).then(function (user) {
          safeCb(callback)(user);
          return user;
        }, function () {
          safeCb(callback)({});
          return {};
        });
      },


      /*
       * Check if a user is logged in
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, function(is)
       * @return {Bool|Promise}
       */
      isLoggedIn: function isLoggedIn(callback) {
        if (arguments.length === 0) {
          return currentUser.hasOwnProperty('role');
        }

        return Auth.getCurrentUser(null).then(function (user) {
          var is = user.hasOwnProperty('role');
          safeCb(callback)(is);
          return is;
        });
      },
      compareRole: function compareRole(r, h) {
        return userRoles.indexOf(r) >= userRoles.indexOf(h);
      },


      /*
       * Check if a user has a specified role or higher
       *   (synchronous|asynchronous)
       *
       * @param  {String}     role     - the role to check against
       * @param  {Function|*} callback - optional, function(has)
       * @return {Bool|Promise}
       */
      hasRole: function hasRole(role, callback) {
        if (arguments.length < 2) {
          return Auth.compareRole(currentUser.role, role);
        }

        return Auth.getCurrentUser(null).then(function (user) {
          var has = user.hasOwnProperty('role') ? Auth.compareRole(user.role, role) : false;
          safeCb(callback)(has);
          return has;
        });
      },


      /*
       * Check if a user is an admin
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, function(is)
       * @return {Bool|Promise}
       */
      isAdmin: function isAdmin() {
        return Auth.hasRole.apply(Auth, [].concat.apply(['admin'], arguments));
      },


      /**
       * Get auth token
       *
       * @return {String} - a token string used for authenticating
       */
      getToken: function getToken() {
        return $cookies.get('token');
      },
      hasPermissionToEdit: function hasPermissionToEdit() {
        var user = Auth.getCurrentUser();
        var userData = user.hasOwnProperty('$promise') && user.hasOwnProperty('$resolved') && !user.$resolved ? user.$promise : user;
        return $q.when(userData);
      }
    };

    return Auth;
  }

  angular.module('superstarsApp.auth').factory('Auth', AuthService);
})();
//# sourceMappingURL=../../components/auth/auth.service.js.map
'use strict';

(function () {

  function authInterceptor($rootScope, $q, $cookies, $injector, Util) {
    var state;
    return {
      // Add authorization token to headers
      request: function request(config) {
        config.headers = config.headers || {};
        if ($cookies.get('token') && Util.isSameOrigin(config.url)) {
          // Internal Superstars call
          config.headers.Authorization = 'Bearer ' + $cookies.get('token');
        } else if ($cookies.get('ssotoken') && !Util.isSameOrigin(config.url)) {
          // Mulesoft and other endpoints
          config.headers.Authorization = 'Bearer ' + $cookies.get('ssotoken');
        }
        return config;
      },


      // Intercept 401s and redirect you to login
      responseError: function responseError(response) {
        if (response.status === 401) {
          (state || (state = $injector.get('$state'))).go('login');
          // remove any stale tokens
          $cookies.remove('token');
          $cookies.remove('ssotoken');
        }
        return $q.reject(response);
      }
    };
  }

  angular.module('superstarsApp.auth').factory('authInterceptor', authInterceptor);
})();
//# sourceMappingURL=../../components/auth/interceptor.service.js.map
'use strict';

(function () {

  angular.module('superstarsApp.auth').run(function ($rootScope, $state, Auth) {
    // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role
    $rootScope.$on('$stateChangeStart', function (event, next) {
      if (next.name === 'login') {
        Auth.isLoggedIn(_.noop).then(function (is) {
          if (is) {
            event.preventDefault();
            $state.go('main');
          }
        });
      }

      if (!next.authenticate) {
        return;
      }

      if (typeof next.authenticate === 'string') {
        Auth.hasRole(next.authenticate, _.noop).then(function (has) {
          if (has) {
            return;
          }

          event.preventDefault();
          return Auth.isLoggedIn(_.noop).then(function (is) {
            $state.go(is ? 'main' : 'login');
          });
        });
      } else {
        Auth.isLoggedIn(_.noop).then(function (is) {
          if (is) {
            return;
          }

          event.preventDefault();
          $state.go('login');
        });
      }
    });
  });
})();
//# sourceMappingURL=../../components/auth/router.decorator.js.map
'use strict';

angular.module('superstarsApp').directive('footer', function () {
  return {
    templateUrl: 'components/footer/footer.html',
    restrict: 'E',
    link: function link(scope, element) {
      element.addClass('footer');
    }
  };
});
//# sourceMappingURL=../../components/footer/footer.directive.js.map
'use strict';

(function () {
  'use strict';

  function HideOnClickWindow($window) {
    return {
      scope: {
        rule: '@'
      },
      restrict: 'A',
      link: function link(scope, element) {
        var el = angular.element(element[0]);
        var window = angular.element($window);

        el.addClass('hide');

        window.bind('click', function () {
          el.addClass('hide');
          scope.rule = false;
        });

        scope.$watch('rule', function () {
          if (scope.rule) {
            el.removeClass('hide');
            window[0].event.stopPropagation();
          }
        });
      }
    };
  }

  angular.module('superstarsApp').directive('hideOnClickWindow', HideOnClickWindow);
})();
//# sourceMappingURL=../../components/hideOnClickWindow/hideOnClickWindow.directive.js.map
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {

  // http://aboutcode.net/2013/07/27/json-date-parsing-angularjs.html
  var iso8601DateRegex = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

  function parseJsonDates(input) {
    if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) !== 'object') {
      return input;
    }

    for (var key in input) {
      var value, match;

      if (!input.hasOwnProperty(key)) {
        continue;
      }

      value = input[key];

      if (typeof value === 'string' && (match = value.match(iso8601DateRegex))) {
        var milliseconds = Date.parse(match[0]);

        if (!isNaN(milliseconds)) {
          input[key] = new Date(milliseconds);
        }
      } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        parseJsonDates(value);
      }
    }
  }

  angular.module('superstarsApp').config(function ($httpProvider) {
    $httpProvider.defaults.transformResponse.push(function (responseData) {
      parseJsonDates(responseData);
      return responseData;
    });
  });
})();
//# sourceMappingURL=../../components/http/json.transformation.js.map
'use strict';

(function () {

  /*
   * Extension of native md-open-on-focus from material angular 
   */

  function ExtendOpenOnFocus(scope, element) {

    var $datePicker = angular.element(element.find('input'));

    $datePicker.on('focus', function () {
      $datePicker.blur();
    });
  }

  angular.module('superstarsApp').directive('mdOpenOnFocus', function () {
    return {
      restrict: 'A',
      link: ExtendOpenOnFocus
    };
  });
})();
//# sourceMappingURL=../../components/mdOpenOnFocusEx/mdOpenOnFocusEx.directive.js.map
'use strict';

/**
 * Removes server error when user updates input
 */

angular.module('superstarsApp').directive('mongooseError', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function link(scope, element, attrs, ngModel) {
      element.on('keydown', function () {
        return ngModel.$setValidity('mongoose', true);
      });
    }
  };
});
//# sourceMappingURL=../../components/mongoose-error/mongoose-error.directive.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NavbarController = function () {
  //end-non-standard

  function NavbarController(Auth, $mdSidenav, NavbarService) {
    _classCallCheck(this, NavbarController);

    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.$mdSidenav = $mdSidenav;
    //Setting current use data through promise - binding context
    Auth.getCurrentUser(this.setCurrentUserData.bind(this));
    this.ACDCLink = 'https://acdc.avenuecode.com';
    this.MilesLink = 'http://acmiles.avenuecode.com';
    this.AcademyLink = 'http://academy.avenuecode.com';
    this.ACPMLink = 'http://acpm.avenuecode.com';
    this.SuperstarsLink = 'main';
    this.NavbarService = NavbarService;
  }

  _createClass(NavbarController, [{
    key: 'setCurrentUserData',
    value: function setCurrentUserData(user) {
      this.currentUser = user;
      this.UserProfileLink = '/profile/' + user.username;
    }
  }, {
    key: 'openLink',
    value: function openLink(link) {
      window.open(link, '_blank');
    }
  }]);

  return NavbarController;
}();

angular.module('superstarsApp').controller('NavbarController', NavbarController);
//# sourceMappingURL=../../components/navbar/navbar.controller.js.map
'use strict';

angular.module('superstarsApp').directive('navbar', function () {
  return {
    templateUrl: 'components/navbar/navbar.html',
    restrict: 'E',
    controller: 'NavbarController',
    controllerAs: 'nav'
  };
});
//# sourceMappingURL=../../components/navbar/navbar.directive.js.map
'use strict';

(function () {
  var STATE_NAME = 'publicprofile';

  function NavbarService($rootScope, $state) {

    function displayNavbar(state) {
      return state.name !== STATE_NAME;
    }

    this.displayNavbar = displayNavbar($state.current);

    $rootScope.$on('$stateChangeStart', function (event, next) {
      this.displayNavbar = displayNavbar(next);
    }.bind(this));
  }

  angular.module('superstarsApp').service('NavbarService', NavbarService);
})();
//# sourceMappingURL=../../components/navbar/navbar.service.js.map
'use strict';

angular.module('superstarsApp').controller('OauthButtonsCtrl', function ($scope, $window, $translate, $cookies, appConfig, Auth) {
  var cookieName = appConfig.cookies.invalidAccount;
  var cookie = $cookies.get(cookieName);
  $scope.serverMessage = '';
  if (cookie) {
    $scope.serverMessage = $translate.instant(appConfig.cookies[cookieName]);
    $cookies.remove(cookieName);
    Auth.logout(); // removing google cookie when the email is not accepted, because passport already added the cookie
  }

  this.loginOauth = function (provider) {
    $window.location.href = '/auth/' + provider;
  };
});
//# sourceMappingURL=../../components/oauth-buttons/oauth-buttons.controller.js.map
'use strict';

angular.module('superstarsApp').directive('oauthButtons', function () {
  return {
    templateUrl: 'components/oauth-buttons/oauth-buttons.html',
    restrict: 'EA',
    controller: 'OauthButtonsCtrl',
    controllerAs: 'OauthButtons',
    scope: {
      classes: '@'
    }
  };
});
//# sourceMappingURL=../../components/oauth-buttons/oauth-buttons.directive.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  var ProfileAboutMeController = function (_ProfileTimelineBaseC) {
    _inherits(ProfileAboutMeController, _ProfileTimelineBaseC);

    function ProfileAboutMeController(ProfileTileLocker, $filter, ProfileService, Screen) {
      _classCallCheck(this, ProfileAboutMeController);

      var _this = _possibleConstructorReturn(this, (ProfileAboutMeController.__proto__ || Object.getPrototypeOf(ProfileAboutMeController)).call(this, '_id', 'startDate', 'profile::tile::aboutme', ProfileTileLocker, $filter, Screen));

      _this.ProfileService = ProfileService;
      _this.profileTileLockerId = 'profile::tile::aboutme';
      _this.path = 'aboutme';
      return _this;
    }

    _createClass(ProfileAboutMeController, [{
      key: 'help',
      value: function help() {
        this.ProfileService.help('About Me', 'Share a brief description about yourself and tell something interesting about you.');
      }
    }, {
      key: 'update',
      value: function update() {
        this.onUpdate({
          path: this.path,
          value: this.user.aboutMe
        });
      }
    }]);

    return ProfileAboutMeController;
  }(ProfileTimelineBaseController);

  angular.module('superstarsApp').component('profileAboutMe', {
    transclude: true,
    templateUrl: 'components/profile/aboutMe/aboutMe.html',
    controller: ProfileAboutMeController,
    bindings: {
      user: '<',
      onUpdate: '&',
      readOnly: '<'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/aboutMe/aboutMe.component.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var ProfileAdminBarController = function () {
    function ProfileAdminBarController(ProfileService) {
      _classCallCheck(this, ProfileAdminBarController);

      this.path = 'onbench';
      this.ProfileService = ProfileService;
    }

    _createClass(ProfileAdminBarController, [{
      key: 'update',
      value: function update() {
        this.onUpdate({
          path: this.path,
          value: this.user.onBench
        });
      }
    }, {
      key: 'delete',
      value: function _delete() {
        var that = this;
        this.ProfileService.confirm(event, 'profile', function () {
          that.deleteProfile();
        });
      }
    }]);

    return ProfileAdminBarController;
  }();

  angular.module('superstarsApp').component('profileAdminBar', {
    transclude: true,
    templateUrl: 'components/profile/adminBar/adminBar.html',
    controller: ProfileAdminBarController,
    bindings: {
      user: '<',
      onUpdate: '&',
      deleteProfile: '&',
      readOnly: '<'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/adminBar/adminBar.component.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var ProfileCertificationController = function () {
    function ProfileCertificationController() {
      _classCallCheck(this, ProfileCertificationController);

      this.model = null;
      this.certificationExpires = false;
      this.currentDate = new Date();
    }

    _createClass(ProfileCertificationController, [{
      key: '$onChanges',
      value: function $onChanges(changes) {
        var certification = changes.certification ? changes.certification.currentValue : null;

        if (certification) {
          this.resetModel(certification);
        }
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        this.certificationExpires = !this.certificationExpires;
        if (!this.certificationExpires) {
          this.model.endDate = null;
        }
      }
    }, {
      key: 'edit',
      value: function edit() {
        if (!this.readOnly) {
          this.onEdit();
        }
      }
    }, {
      key: 'update',
      value: function update($form) {
        if ($form.$valid) {
          angular.copy(this.model, this.certification);
          this.onUpdate({
            certification: this.certification
          });
        }
      }
    }, {
      key: 'cancel',
      value: function cancel(form) {
        if (form) {
          form.$setPristine();
        }

        this.resetModel();
        this.onCancel();
      }
    }, {
      key: 'resetModel',
      value: function resetModel(certification) {
        this.model = angular.copy(certification || this.certification);
        this.certificationExpires = !!this.model.endDate;
      }
    }]);

    return ProfileCertificationController;
  }();

  angular.module('superstarsApp').component('profileCertification', {
    templateUrl: 'components/profile/certification/certification.html',
    controller: ProfileCertificationController,
    bindings: {
      certification: '<',
      editing: '<',
      onCancel: '&',
      onEdit: '&',
      onUpdate: '&',
      readOnly: '<'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/certification/certification.component.js.map
/* exported ProfileTimelineBaseController */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  var ProfileCertificationsController = function (_ProfileTimelineBaseC) {
    _inherits(ProfileCertificationsController, _ProfileTimelineBaseC);

    function ProfileCertificationsController(ProfileTileLocker, $filter, ProfileService, $window, Screen) {
      _classCallCheck(this, ProfileCertificationsController);

      var _this = _possibleConstructorReturn(this, (ProfileCertificationsController.__proto__ || Object.getPrototypeOf(ProfileCertificationsController)).call(this, '_id', 'startDate', 'profile::tile::certifications', ProfileTileLocker, $filter, Screen));

      _this.ProfileService = ProfileService;
      _this.modelField = 'certifications';
      _this.path = 'certification';
      _this.limitMobile = 3;
      return _this;
    }

    _createClass(ProfileCertificationsController, [{
      key: 'updateItem',
      value: function updateItem(certification) {
        var data = {
          path: this.path,
          object: certification,
          field: this.modelField
        };
        _get(ProfileCertificationsController.prototype.__proto__ || Object.getPrototypeOf(ProfileCertificationsController.prototype), 'updateItem', this).call(this, certification);
        angular.isUndefined(certification._id) ? this.onSave(data) : this.onUpdate(data);
      }
    }, {
      key: 'removeItem',
      value: function removeItem(item) {
        if (item._id) {
          var that = this;
          this.ProfileService.confirm(event, 'certification', function () {
            that.items.splice(that.items.indexOf(item), 1);
            that.setItemInEditMode(null);
            that.onDelete({
              path: that.path,
              id: item._id
            });
          });
        } else {
          _get(ProfileCertificationsController.prototype.__proto__ || Object.getPrototypeOf(ProfileCertificationsController.prototype), 'cancelItem', this).call(this, item);
        }
      }
    }, {
      key: 'help',
      value: function help() {
        this.ProfileService.help('Certifications', 'Add all of your certifications.');
      }
    }]);

    return ProfileCertificationsController;
  }(ProfileTimelineBaseController);

  angular.module('superstarsApp').component('profileCertifications', {
    transclude: true,
    templateUrl: 'components/profile/certifications/certifications.html',
    controller: ProfileCertificationsController,
    bindings: {
      items: '<',
      onUpdate: '&',
      onDelete: '&',
      onSave: '&',
      readOnly: '<'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/certifications/certifications.component.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  var ProfileContactController = function (_ProfileTimelineBaseC) {
    _inherits(ProfileContactController, _ProfileTimelineBaseC);

    function ProfileContactController(ProfileTileLocker, $filter, ProfileService, Screen) {
      _classCallCheck(this, ProfileContactController);

      var _this = _possibleConstructorReturn(this, (ProfileContactController.__proto__ || Object.getPrototypeOf(ProfileContactController)).call(this, '_id', 'startDate', 'profile::tile::contacts', ProfileTileLocker, $filter, Screen));

      _this.ProfileService = ProfileService;
      _this.profileTileLockerId = 'profile::tile::contacts';
      return _this;
    }

    _createClass(ProfileContactController, [{
      key: 'help',
      value: function help() {
        this.ProfileService.help('Contacts', 'Add your personal contact information here.');
      }
    }, {
      key: 'update',
      value: function update(path) {
        var value = this.user.social[path];
        this.onUpdate({
          path: path,
          value: value
        });
      }
    }]);

    return ProfileContactController;
  }(ProfileTimelineBaseController);

  angular.module('superstarsApp').component('profileContacts', {
    transclude: true,
    templateUrl: 'components/profile/contacts/contacts.html',
    controller: ProfileContactController,
    bindings: {
      user: '<',
      onUpdate: '&',
      readOnly: '<'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/contacts/contacts.component.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var ProfileEducationController = function () {
    function ProfileEducationController() {
      _classCallCheck(this, ProfileEducationController);

      this.model = null;
      this.currentDate = new Date();
    }

    _createClass(ProfileEducationController, [{
      key: '$onChanges',
      value: function $onChanges(changes) {
        var education = changes.education ? changes.education.currentValue : null;

        if (education) {
          this.resetModel(education);
        }
      }
    }, {
      key: 'edit',
      value: function edit() {
        if (!this.readOnly) {
          this.onEdit();
        }
      }
    }, {
      key: 'update',
      value: function update($form) {
        if ($form.$valid) {
          angular.copy(this.model, this.education);
          this.onUpdate({
            education: this.education
          });
        }
      }
    }, {
      key: 'cancel',
      value: function cancel(form) {
        if (form) {
          form.$setPristine();
        }

        this.resetModel();
        this.onCancel();
      }
    }, {
      key: 'resetModel',
      value: function resetModel(education) {
        this.model = angular.copy(education || this.education);
      }
    }]);

    return ProfileEducationController;
  }();

  angular.module('superstarsApp').component('profileEducation', {
    transclude: true,
    templateUrl: 'components/profile/education/education.html',
    controller: ProfileEducationController,
    bindings: {
      editing: '<',
      education: '<',
      readOnly: '<',
      onEdit: '&',
      onUpdate: '&',
      onCancel: '&'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/education/education.component.js.map
/* exported ProfileTimelineBaseController */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  var ProfileEducationsController = function (_ProfileTimelineBaseC) {
    _inherits(ProfileEducationsController, _ProfileTimelineBaseC);

    function ProfileEducationsController(ProfileTileLocker, $filter, $window, ProfileService, Screen) {
      _classCallCheck(this, ProfileEducationsController);

      var _this = _possibleConstructorReturn(this, (ProfileEducationsController.__proto__ || Object.getPrototypeOf(ProfileEducationsController)).call(this, '_id', 'startDate', 'profile::tile::educations', ProfileTileLocker, $filter, Screen));

      _this.ProfileService = ProfileService;
      _this.path = _this.modelField = 'education';
      _this.limitMobile = 3;
      return _this;
    }

    _createClass(ProfileEducationsController, [{
      key: 'updateItem',
      value: function updateItem(education) {
        var data = {
          path: this.path,
          object: education,
          field: this.modelField
        };
        _get(ProfileEducationsController.prototype.__proto__ || Object.getPrototypeOf(ProfileEducationsController.prototype), 'updateItem', this).call(this, education);
        angular.isUndefined(education._id) ? this.onSave(data) : this.onUpdate(data);
      }
    }, {
      key: 'removeItem',
      value: function removeItem(item) {
        if (item._id) {
          var that = this;
          this.ProfileService.confirm(event, 'education', function () {
            that.items.splice(that.items.indexOf(item), 1);
            that.setItemInEditMode(null);
            that.onDelete({
              path: that.path,
              id: item._id
            });
          });
        } else {
          _get(ProfileEducationsController.prototype.__proto__ || Object.getPrototypeOf(ProfileEducationsController.prototype), 'cancelItem', this).call(this, item);
        }
      }
    }, {
      key: 'help',
      value: function help() {
        this.ProfileService.help('Educations', 'Add here your educational background.');
      }
    }]);

    return ProfileEducationsController;
  }(ProfileTimelineBaseController);

  angular.module('superstarsApp').component('profileEducations', {
    transclude: true,
    templateUrl: 'components/profile/educations/educations.html',
    controller: ProfileEducationsController,
    bindings: {
      items: '<',
      readOnly: '<',
      onUpdate: '&',
      onDelete: '&',
      onSave: '&'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/educations/educations.component.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  var ProfileHobbiesController = function (_ProfileTimelineBaseC) {
    _inherits(ProfileHobbiesController, _ProfileTimelineBaseC);

    function ProfileHobbiesController(ProfileTileLocker, $filter, ProfileService, Screen) {
      _classCallCheck(this, ProfileHobbiesController);

      var _this = _possibleConstructorReturn(this, (ProfileHobbiesController.__proto__ || Object.getPrototypeOf(ProfileHobbiesController)).call(this, '_id', 'startDate', 'profile::tile::hobbies', ProfileTileLocker, $filter, Screen));

      _this.ProfileService = ProfileService;
      _this.profileTileLockerId = 'profile::tile::hobbies';
      _this.path = 'hobby';
      _this.modelField = 'hobbies';
      return _this;
    }

    _createClass(ProfileHobbiesController, [{
      key: 'help',
      value: function help() {
        this.ProfileService.help('Hobbies', 'Add the things you like to do in your spare time.');
      }
    }, {
      key: 'save',
      value: function save() {
        this.onSave({
          path: this.path,
          object: this.user.hobbies[this.user.hobbies.length - 1],
          field: this.modelField
        });
      }
    }, {
      key: 'remove',
      value: function remove(item) {
        this.onDelete({
          path: this.path,
          id: item._id
        });
      }
    }, {
      key: 'newHobby',
      value: function newHobby(hobby) {
        return {
          name: hobby
        };
      }
    }]);

    return ProfileHobbiesController;
  }(ProfileTimelineBaseController);

  angular.module('superstarsApp').component('profileHobbies', {
    templateUrl: 'components/profile/hobbies/hobbies.html',
    controller: ProfileHobbiesController,
    bindings: {
      user: '<',
      onSave: '&',
      onDelete: '&',
      readOnly: '<'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/hobbies/hobbies.component.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  var ProfileLanguagesController = function (_ProfileTimelineBaseC) {
    _inherits(ProfileLanguagesController, _ProfileTimelineBaseC);

    function ProfileLanguagesController(ProfileTileLocker, $filter, ProfileService, Screen) {
      _classCallCheck(this, ProfileLanguagesController);

      var _this = _possibleConstructorReturn(this, (ProfileLanguagesController.__proto__ || Object.getPrototypeOf(ProfileLanguagesController)).call(this, '_id', 'startDate', 'profile::tile::languages', ProfileTileLocker, $filter, Screen));

      _this.ProfileService = ProfileService;
      _this.orderBy = $filter('orderBy');
      _this.starIsHovered = [];
      _this.profileTileLockerId = 'profile::tile::languages';
      _this.path = 'language';
      _this.modelField = 'languageSkills';
      _this.limitMobile = 5;
      _this.limitTo = null;
      _this.enableShowMoreButton();
      return _this;
    }

    _createClass(ProfileLanguagesController, [{
      key: '$onChanges',
      value: function $onChanges(changesObj) {
        if (changesObj.user && changesObj.user.currentValue) {
          changesObj.user.currentValue.languageSkills = this.orderBy(changesObj.user.currentValue.languageSkills, 'level', true);
          this.starIsHovered = new Array(changesObj.user.currentValue.languageSkills.length).fill(0);
        }
      }
    }, {
      key: 'doUpdate',
      value: function doUpdate(language) {
        if (language.name !== undefined && language.name !== '' && language.level > 0) {
          this.update(language);
        }
      }
    }, {
      key: 'addItem',
      value: function addItem() {
        this.user.languageSkills.unshift({
          name: '',
          level: 1
        });
        this.disabledShowMoreButton = true;
      }
    }, {
      key: 'removeItem',
      value: function removeItem(language) {
        if (language._id) {
          var that = this;
          this.ProfileService.confirm(event, 'language', function () {
            that.user.languageSkills.splice(that.user.languageSkills.indexOf(language), 1);
            that.onDelete({
              path: that.path,
              id: language._id
            });
          });
        } else {
          var index = this.user.languageSkills.indexOf(language);
          this.user.languageSkills.splice(index, 1);
          this.enableShowMoreButton();
        }
      }
    }, {
      key: 'update',
      value: function update(language) {
        var data = {
          path: this.path,
          object: language,
          field: this.modelField
        };
        angular.isUndefined(language._id) ? this.onSave(data) : this.onUpdate(data);
        this.enableShowMoreButton();
      }
    }, {
      key: 'enableShowMoreButton',
      value: function enableShowMoreButton() {
        this.disabledShowMoreButton = false;
      }
    }, {
      key: 'setLevel',
      value: function setLevel(language, level) {
        if (!this.readOnly) {
          this.user.languageSkills[this.user.languageSkills.indexOf(language)].level = level;
          this.doUpdate(language);
        }
      }
    }, {
      key: 'getLevelClass',
      value: function getLevelClass(language, level) {
        var classname = ['empty'];
        level <= language.level && classname.push('selected');
        level <= this.starIsHovered[this.user.languageSkills.indexOf(language)] && classname.push('levelhover');
        return classname.join(' ');
      }
    }, {
      key: 'setHover',
      value: function setHover(language, level) {
        if (!this.readOnly) {
          this.starIsHovered[this.user.languageSkills.indexOf(language)] = level;
        }
      }
    }, {
      key: 'unsetHover',
      value: function unsetHover(language) {
        if (!this.readOnly) {
          this.starIsHovered[this.user.languageSkills.indexOf(language)] = 0;
        }
      }
    }, {
      key: 'help',
      value: function help() {
        this.ProfileService.help('Languages', 'Add the languages you know and your proficiency.');
      }
    }]);

    return ProfileLanguagesController;
  }(ProfileTimelineBaseController);

  angular.module('superstarsApp').component('profileLanguages', {
    transclude: true,
    templateUrl: 'components/profile/languages/languages.html',
    controller: ProfileLanguagesController,
    bindings: {
      user: '<',
      onUpdate: '&',
      onSave: '&',
      onDelete: '&',
      readOnly: '<'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/languages/languages.component.js.map
'use strict';

(function () {

  function ProfileService($mdDialog) {

    var buttonText = 'Got it!';

    var service = {
      help: function help(title, text) {
        $mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title(title).textContent(text).ok(buttonText));
      },
      confirm: function confirm(ev, name, cb) {
        var confirm = $mdDialog.confirm({
          template: '<md-dialog>' + '   <md-dialog-content class="md-dialog-content">' + '     <h2 class="md-title">Are you sure?</h2>' + '     <p>You can\'t recover your data if you delete this ' + name.toLowerCase() + '.</p>' + '   </md-dialog-content>' + '   <md-dialog-actions class="md-dialog-content">' + '    <md-button ng-click="dialog.hide()" class="md-raised" style="text-transform: none;">' + '      Yes, delete it' + '    </md-button>' + '    <div flex></div>' + '    <md-button ng-click="dialog.abort()" class="md-raised md-primary" style="text-transform: none;">' + '      Keep it' + '    </md-button>' + '   </md-dialog-actions>' + '</md-dialog>',
          clickOutsideToClose: true,
          escapeToClose: true
        });

        $mdDialog.show(confirm).then(cb);
      },
      emptyProfileReminder: function emptyProfileReminder(ev, cb) {
        var reminder = $mdDialog.confirm({
          template: '<md-dialog>' + '   <md-dialog-content class="md-dialog-content">' + '     <h2 class="md-title">Please, fill your basic information</h2>' + '     <p>Help us to know more about you!</p>' + '     <p>Please, go to your profile and fill at least your Role, Skype, About Me and Qualification Summary fields.</p>' + '   </md-dialog-content>' + '   <md-dialog-actions class="md-dialog-content">' + '    <md-button ng-click="dialog.abort()" class="md-raised" style="text-transform: none;">' + '      Remind me later' + '    </md-button>' + '    <div flex></div>' + '    <md-button ng-click="dialog.hide()" class="md-raised md-primary" style="text-transform: none;">' + '      Take me there!' + '    </md-button>' + '   </md-dialog-actions>' + '</md-dialog>',
          clickOutsideToClose: true,
          escapeToClose: true
        });

        $mdDialog.show(reminder).then(cb);
      }
    };

    return service;
  }

  angular.module('superstarsApp').factory('ProfileService', ProfileService);
})();
//# sourceMappingURL=../../components/profile/profile.service.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  var ProfileQualificationSummaryController = function (_ProfileTimelineBaseC) {
    _inherits(ProfileQualificationSummaryController, _ProfileTimelineBaseC);

    function ProfileQualificationSummaryController(ProfileTileLocker, $filter, ProfileService, Screen) {
      _classCallCheck(this, ProfileQualificationSummaryController);

      var _this = _possibleConstructorReturn(this, (ProfileQualificationSummaryController.__proto__ || Object.getPrototypeOf(ProfileQualificationSummaryController)).call(this, '_id', 'startDate', 'profile::tile::qualificationSummary', ProfileTileLocker, $filter, Screen));

      _this.ProfileService = ProfileService;
      _this.profileTileLockerId = 'profile::tile::qualificationSummary';
      _this.path = 'summary';
      return _this;
    }

    _createClass(ProfileQualificationSummaryController, [{
      key: 'help',
      value: function help() {
        this.ProfileService.help('Qualification Summary', 'Tell us about your technical and professional profile.');
      }
    }, {
      key: 'update',
      value: function update() {
        this.onUpdate({
          path: this.path,
          value: this.user.summaryOfQualification
        });
      }
    }]);

    return ProfileQualificationSummaryController;
  }(ProfileTimelineBaseController);

  angular.module('superstarsApp').component('profileQualificationSummary', {
    transclude: true,
    templateUrl: 'components/profile/qualificationSummary/qualificationSummary.html',
    controller: ProfileQualificationSummaryController,
    bindings: {
      user: '<',
      onUpdate: '&',
      readOnly: '<'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/qualificationSummary/qualificationSummary.component.js.map
'use strict';

angular.module('superstarsApp').directive('skillsFocusOn', function () {
	return {
		restrict: 'A',
		link: function link(scope, element, attrs) {
			scope.$watch(attrs.skillsFocusOn, function (newValue) {
				if (newValue && scope.skill.skill === '') {
					element.focus();
				}
			});
		}
	};
});
//# sourceMappingURL=../../../components/profile/skills/skills-focus-on.directive.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  var ProfileSkillsController = function (_ProfileTimelineBaseC) {
    _inherits(ProfileSkillsController, _ProfileTimelineBaseC);

    function ProfileSkillsController(ProfileTileLocker, $filter, ProfileService, Screen, Skill, $location, $anchorScroll) {
      _classCallCheck(this, ProfileSkillsController);

      var _this = _possibleConstructorReturn(this, (ProfileSkillsController.__proto__ || Object.getPrototypeOf(ProfileSkillsController)).call(this, '_id', 'startDate', 'profile::tile::skills', ProfileTileLocker, $filter, Screen));

      _this.ProfileService = ProfileService;
      _this.Screen = Screen;
      _this.min = 0;
      _this.max = 15;
      _this.limitMobile = 5;
      _this.orderBy = $filter('orderBy');
      _this.profileTileLockerId = 'profile::tile::skills';
      _this.path = 'skill';
      _this.modelField = 'skillsCloud';
      _this.showMoreClick = false;
      _this.disabledShowMoreButton = false;
      _this.items = Skill.getSkills();
      _this.showAutocomplete = false;
      _this.searchText = '';
      _this.location = $location;
      _this.anchorScroll = $anchorScroll;
      return _this;
    }

    _createClass(ProfileSkillsController, [{
      key: '$onChanges',
      value: function $onChanges(changesObj) {
        if (changesObj.user && changesObj.user.currentValue) {
          changesObj.user.currentValue.skillsCloud = this.orderBy(changesObj.user.currentValue.skillsCloud, 'experienceYears', true);
        }
      }
    }, {
      key: 'gotoNewSkill',
      value: function gotoNewSkill() {
        this.location.hash('skills-tile');
        this.anchorScroll();
      }
    }, {
      key: 'displayAutocomplete',
      value: function displayAutocomplete() {
        this.gotoNewSkill();
        this.showAutocomplete = true;
      }
    }, {
      key: 'isDuplicate',
      value: function isDuplicate(item) {
        var skillNamesList = this.user.skillsCloud.map(function (data) {
          return data.name;
        }),
            itemName = item.name || item.info;
        return skillNamesList.indexOf(itemName) >= 0;
      }
    }, {
      key: 'addItem',
      value: function addItem(item) {
        if (!item) {
          return;
        }

        if (!this.isDuplicate(item)) {
          this.user.skillsCloud.unshift({
            name: item.name,
            experienceYears: 0
          });
          this.disabledShowMoreButton = true;
          this.showAutocomplete = false;
          this.searchText = '';
          delete this.skillAutocompleteForm.skillAutocomplete.$error.duplicate;
          this.skillAutocompleteForm.skillAutocomplete.$invalid = false;

          var skill = {};
          skill.name = item.name;
          skill.experienceYears = 0;

          var data = {
            path: this.path,
            object: skill,
            field: this.modelField
          };
          this.onSave(data);
        } else {
          console.log('it\'s a DUP');
          this.skillAutocompleteForm.skillAutocomplete.$error.duplicate = true;
          this.skillAutocompleteForm.skillAutocomplete.$invalid = true;
        }
      }
    }, {
      key: 'focusItem',
      value: function focusItem() {
        var inputToBeFocused = this.Screen.isExtraSmallScreen() ? '$last' : '$first';
        return inputToBeFocused;
      }
    }, {
      key: 'updateItem',
      value: function updateItem(skill) {
        var data = {
          path: this.path,
          object: skill,
          field: this.modelField
        };
        if (angular.isUndefined(skill.experienceYears)) {
          skill.experienceYears = 0;
        }
        if (angular.isUndefined(skill.name) || skill.name === '') {
          return;
        }
        angular.isUndefined(skill._id) ? this.onSave(data) : this.onUpdate(data);
        this.disabledShowMoreButton = false;
      }
    }, {
      key: 'removeItem',
      value: function removeItem(skill) {
        if (skill && skill._id) {
          var that = this;
          this.ProfileService.confirm(event, 'skill', function () {
            that.user.skillsCloud.splice(that.user.skillsCloud.indexOf(skill), 1);
            that.onDelete({
              path: that.path,
              id: skill._id
            });
            that.disabledShowMoreButton = false;
          });
        } else {
          this.showAutocomplete = false;
        }
        this.disabledShowMoreButton = false;
      }
    }, {
      key: 'help',
      value: function help() {
        this.ProfileService.help('Skills', 'Add your professional skills.');
      }
    }, {
      key: 'querySearch',
      value: function querySearch(query) {
        var results = query ? this.items.filter(this.createFilterFor(query)) : this.items;
        return results;
      }
    }, {
      key: 'createFilterFor',
      value: function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(skill) {
          return angular.lowercase(skill.name).indexOf(lowercaseQuery) === 0;
        };
      }
    }]);

    return ProfileSkillsController;
  }(ProfileTimelineBaseController);

  angular.module('superstarsApp').component('profileSkills', {
    templateUrl: 'components/profile/skills/skills.html',
    controller: ProfileSkillsController,
    bindings: {
      user: '<',
      onUpdate: '&',
      onSave: '&',
      onDelete: '&',
      readOnly: '<'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/skills/skills.component.js.map
'use strict';

(function () {

  function ProfileTileLocker() {
    var subscribers = [],
        noop = function noop() {};

    var locked = false;

    var notifier = {
      subscribe: function subscribe(lockerId, callback) {
        var subscriberId = Symbol(),
            subscriber = {
          sid: subscriberId,
          lockerId: lockerId,
          callback: callback || noop,
          acquiredLock: false
        };

        subscribers.push(subscriber);

        return {
          lock: function lock() {
            if (locked) {
              return;
            }

            locked = true;
            subscriber.acquiredLock = true;

            subscribers.forEach(function (subscriber) {
              subscriber.callback(subscriber.lockerId === lockerId ? false : true);
            });
          },

          unlock: function unlock() {
            if (!locked || !subscriber.acquiredLock) {
              return;
            }

            locked = false;
            subscriber.acquiredLock = false;

            subscribers.forEach(function (subscriber) {
              subscriber.callback(false);
            });
          },

          unsubscribe: function unsubscribe() {
            var index = subscribers.indexOf(subscriber);
            if (index !== -1) {
              subscribers.splice(index, 1);

              if (subscriber.acquiredLock) {
                this.unlock();
              }
            }
          }
        };
      }
    };

    return notifier;
  }

  angular.module('superstarsApp').factory('ProfileTileLocker', ProfileTileLocker);
})();
//# sourceMappingURL=../../../components/profile/tileLocker/profileTileLocker.service.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var ProfileTileController = function () {
    function ProfileTileController(ProfileTileLocker, Screen) {
      _classCallCheck(this, ProfileTileController);

      this.ProfileTileLocker = ProfileTileLocker;
      this.addButtonEnabled = angular.isDefined(this.addButtonEnabled) ? this.addButtonEnabled : true;
      this.initTileLockListener();
      this.SHOW_MORE_BUTTON = {
        SHOW_MORE: 'Show More',
        SHOW_LESS: 'Show Less'
      };
      this.showMoreText = this.SHOW_MORE_BUTTON.SHOW_MORE;
      this.Screen = Screen;
    }

    _createClass(ProfileTileController, [{
      key: '$onInit',
      value: function $onInit() {
        if (this.Screen.isExtraSmallScreen()) {
          this.limitItemsMobile = this.maxItemsMobile;
        }
      }
    }, {
      key: 'initTileLockListener',
      value: function initTileLockListener() {
        var _this = this;

        if (!this.profileTileLockerId) {
          return;
        }

        this.tileLocker = this.ProfileTileLocker.subscribe(this.profileTileLockerId, function (locked) {
          _this.locked = locked;
        });
      }
    }, {
      key: 'changeShowMoreButtonText',
      value: function changeShowMoreButtonText() {
        this.showMoreText = this.showMoreText === this.SHOW_MORE_BUTTON.SHOW_MORE ? this.SHOW_MORE_BUTTON.SHOW_LESS : this.SHOW_MORE_BUTTON.SHOW_MORE;
      }
    }, {
      key: '$onDestroy',
      value: function $onDestroy() {
        if (this.tileLocker) {
          this.tileLocker.unsubscribe();
        }
      }
    }, {
      key: 'showShowMoreButton',
      value: function showShowMoreButton() {
        if (this.Screen.isExtraSmallScreen()) {
          return parseInt(this.itemsLength) > parseInt(this.maxItemsMobile);
        }
        return false;
      }
    }, {
      key: 'onShowMore',
      value: function onShowMore() {
        this.showMoreClick = !this.showMoreClick;
        this.limitItemsMobile = this.showMoreClick ? null : this.maxItemsMobile;
      }
    }]);

    return ProfileTileController;
  }();

  angular.module('superstarsApp').component('profileTile', {
    transclude: true,
    templateUrl: 'components/profile/tile/profileTile.html',
    controller: ProfileTileController,
    bindings: {
      title: '@',
      icon: '@',
      addButtonFlex: '@',
      showAddButton: '@',
      addButtonEnabled: '<',
      profileTileLockerId: '<',
      onHelp: '&',
      onAddItem: '&',
      limitItemsMobile: '=',
      maxItemsMobile: '<',
      itemsLength: '<',
      disabledShowMoreButton: '<',
      locked: '<',
      readOnly: '<'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/tile/profileTile.component.js.map
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var ProfileTimelineItemController = function ProfileTimelineItemController() {
    _classCallCheck(this, ProfileTimelineItemController);
  };

  angular.module('superstarsApp').component('profileTimelineItem', {
    transclude: true,
    templateUrl: 'components/profile/timelineItem/timelineItem.html',
    controller: ProfileTimelineItemController,
    bindings: {
      year: '@',
      blocked: '<',
      readOnly: '<',
      fixedRemoveIcon: '<',
      onRemove: '&'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/timelineItem/timelineItem.component.js.map
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var ProfileTimelineTileController = function ProfileTimelineTileController() {
    _classCallCheck(this, ProfileTimelineTileController);
  };

  angular.module('superstarsApp').component('profileTimelineTile', {
    transclude: true,
    templateUrl: 'components/profile/timelineTile/timelineTile.html',
    controller: ProfileTimelineTileController,
    bindings: {
      title: '@',
      icon: '@',
      addButtonFlex: '@',
      showAddButton: '@',
      addButtonEnabled: '<',
      profileTileLockerId: '<',
      onHelp: '&',
      onAddItem: '&',
      limitItemsMobile: '=',
      maxItemsMobile: '<',
      itemsLength: '<',
      locked: '<',
      readOnly: '<'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/timelineTile/timelineTile.component.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var TopBarController = function () {
    function TopBarController(Position) {
      _classCallCheck(this, TopBarController);

      this.PositionService = Position;
      this.path = 'position';
      this.modelField = 'positions';
      this.positionList = [];
    }

    _createClass(TopBarController, [{
      key: '$onInit',
      value: function $onInit() {
        if (!this.readOnly) {
          this.PositionService.getPositions({}, this.loadAvailablePositions.bind(this));
        }
      }
    }, {
      key: '$onChanges',
      value: function $onChanges(dataChange) {
        //Once the components are loaded in diff order, the data may come after topbar is initialized
        if (dataChange.user && dataChange.user.currentValue) {
          this.userPositions = dataChange.user.currentValue.positions || [];
        }
      }
    }, {
      key: 'loadAvailablePositions',
      value: function loadAvailablePositions(data) {
        this.positionList = data;
      }
    }, {
      key: 'addPosition',
      value: function addPosition() {
        this.onSave({
          path: this.path,
          object: this.user.positions[this.user.positions.length - 1],
          field: this.modelField
        });
      }
    }, {
      key: 'removePosition',
      value: function removePosition(chip) {
        this.onDelete({
          path: this.path,
          id: chip._id
        });
      }
    }, {
      key: 'transformChip',
      value: function transformChip(position) {
        return {
          name: position
        };
      }
    }, {
      key: 'getAvailablePositions',
      value: function getAvailablePositions(searchText) {
        if (!searchText || searchText.length < 2) {
          return [];
        }
        var availablePositions = this.positionList.map(function (a) {
          return a.name;
        });
        var currentUserPosition = this.userPositions.map(function (a) {
          return a.name;
        });
        var patt = new RegExp('.*' + searchText + '.*', 'i');
        return availablePositions.filter(function (data) {
          return patt.test(data) && currentUserPosition.indexOf(data) === -1;
        }).map(function (data) {
          return data;
        });
      }
    }]);

    return TopBarController;
  }();

  angular.module('superstarsApp').component('topBar', {
    templateUrl: 'components/profile/topBar/topBar.html',
    controller: TopBarController,
    bindings: {
      user: '<',
      onSave: '&',
      onDelete: '&',
      readOnly: '<'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/topBar/topBar.component.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var namesAC = ['avenuecode', 'ac', 'avenue code'];

  var ProfileWorkingExperienceController = function () {
    function ProfileWorkingExperienceController() {
      _classCallCheck(this, ProfileWorkingExperienceController);

      this.model = null;
      this.currentDate = new Date();
      this.AvenueCodeCompany = 'Avenue Code';
    }

    _createClass(ProfileWorkingExperienceController, [{
      key: '$onChanges',
      value: function $onChanges(changes) {
        var experience = changes.experience ? changes.experience.currentValue : null;

        if (experience) {
          this.resetModel(experience);
        }
      }
    }, {
      key: 'edit',
      value: function edit() {
        if (!this.readOnly) {
          this.onEdit();
        }
      }
    }, {
      key: 'update',
      value: function update($form) {
        if ($form.$valid) {
          if (this.model.isCurrentPosition) {
            this.model.endDate = null;
          }
          angular.copy(this.model, this.experience);
          this.onUpdate({
            experience: this.experience
          });
        }
      }
    }, {
      key: 'cancel',
      value: function cancel(form) {
        if (form) {
          form.$setPristine();
        }

        this.resetModel();
        this.onCancel();
      }
    }, {
      key: 'resetModel',
      value: function resetModel(experience) {
        this.model = angular.copy(experience || this.experience);
        this.model.isAvenueCode = namesAC.indexOf(this.model.company.toLowerCase()) > -1;
      }
    }, {
      key: 'fillAvenueCodeCompany',
      value: function fillAvenueCodeCompany() {
        if (this.model.isAvenueCode) {
          this.model.company = this.AvenueCodeCompany;
        } else {
          this.model.client = this.model.company = this.model.project = '';
        }
      }
    }]);

    return ProfileWorkingExperienceController;
  }();

  angular.module('superstarsApp').component('profileWorkingExperience', {
    templateUrl: 'components/profile/workingExperience/workingExperience.html',
    controller: ProfileWorkingExperienceController,
    bindings: {
      editing: '<',
      experience: '<',
      readOnly: '<',
      onEdit: '&',
      onUpdate: '&',
      onCancel: '&'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/workingExperience/workingExperience.component.js.map
/* exported ProfileTimelineBaseController */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  var ProfileWorkingExperiencesController = function (_ProfileTimelineBaseC) {
    _inherits(ProfileWorkingExperiencesController, _ProfileTimelineBaseC);

    function ProfileWorkingExperiencesController(ProfileTileLocker, $filter, $window, ProfileService, Screen) {
      _classCallCheck(this, ProfileWorkingExperiencesController);

      var _this = _possibleConstructorReturn(this, (ProfileWorkingExperiencesController.__proto__ || Object.getPrototypeOf(ProfileWorkingExperiencesController)).call(this, '_id', 'startDate', 'profile::tile::workingexperiences', ProfileTileLocker, $filter, Screen));

      _this.ProfileService = ProfileService;
      _this.path = 'experience';
      _this.modelField = 'experiences';
      _this.limitMobile = 3;
      return _this;
    }

    _createClass(ProfileWorkingExperiencesController, [{
      key: 'updateItem',
      value: function updateItem(experience) {
        var data = {
          path: this.path,
          object: experience,
          field: this.modelField
        };
        _get(ProfileWorkingExperiencesController.prototype.__proto__ || Object.getPrototypeOf(ProfileWorkingExperiencesController.prototype), 'updateItem', this).call(this, experience);
        angular.isUndefined(experience._id) ? this.onSave(data) : this.onUpdate(data);
      }
    }, {
      key: 'removeItem',
      value: function removeItem(item) {
        if (item._id) {
          var that = this;
          this.ProfileService.confirm(event, 'experience', function () {
            that.items.splice(that.items.indexOf(item), 1);
            that.setItemInEditMode(null);
            that.onDelete({
              path: that.path,
              id: item._id
            });
          });
        } else {
          _get(ProfileWorkingExperiencesController.prototype.__proto__ || Object.getPrototypeOf(ProfileWorkingExperiencesController.prototype), 'cancelItem', this).call(this, item);
        }
      }
    }, {
      key: 'help',
      value: function help() {
        this.ProfileService.help('Working Experiences', 'Add your previous work experiences.');
      }
    }]);

    return ProfileWorkingExperiencesController;
  }(ProfileTimelineBaseController);

  angular.module('superstarsApp').component('profileWorkingExperiences', {
    transclude: true,
    templateUrl: 'components/profile/workingExperiences/workingExperiences.html',
    controller: ProfileWorkingExperiencesController,
    bindings: {
      items: '<',
      readOnly: '<',
      onUpdate: '&',
      onDelete: '&',
      onSave: '&'
    }
  });
})();
//# sourceMappingURL=../../../components/profile/workingExperiences/workingExperiences.component.js.map
'use strict';

(function () {

  /**
   * Screen service for thin and globally reusable screen functions
   */
  function ScreenService($window) {
    var Screen = {

      /**
       * Returns `true` if the screen is smaller than 600px or false otherwise
       *
       * @return {Boolean}
       */
      isExtraSmallScreen: function isExtraSmallScreen() {
        return $window.outerWidth < 600;
      }
    };

    return Screen;
  }

  angular.module('superstarsApp.screen').factory('Screen', ScreenService);
})();
//# sourceMappingURL=../../components/screen/screen.service.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var ScrollTopController = function () {
    function ScrollTopController($element) {
      _classCallCheck(this, ScrollTopController);

      this.defaultMiliseconds = 500;
      this.defaultHeight = 100;
      this.parentElement = angular.element(document.getElementById('user-cards-content'));
      this.element = $element;
      this.parentElement.on('scroll', this.scrollEvent.bind(this));
    }

    _createClass(ScrollTopController, [{
      key: 'scrollEvent',
      value: function scrollEvent() {
        var display = this.parentElement.scrollTop() >= (this.minHeight || this.defaultHeight) ? 'block' : 'none';
        this.element.css({
          display: display
        });
      }
    }, {
      key: 'goTop',
      value: function goTop() {
        this.parentElement.scrollTop(0, this.miliseconds || this.defaultMiliseconds);
      }
    }]);

    return ScrollTopController;
  }();

  angular.module('superstarsApp').component('scrollTopButton', {
    templateUrl: 'components/scrollTopButton/scrollTopButton.html',
    controller: ScrollTopController,
    bindings: {
      parentId: '@',
      minHeight: '@',
      miliseconds: '@'
    }
  });
})();
//# sourceMappingURL=../../components/scrollTopButton/scrollTopButton.component.js.map
'use strict';

(function () {
    function ChartService($resource) {
        return $resource('/api/charts/:chart', {
            chart: '@chart'
        }, {
            getTotalPerSkill: {
                method: 'GET',
                isArray: true,
                params: {
                    chart: 'total-per-skill'
                }
            },
            getExperiencePerSkill: {
                method: 'GET',
                isArray: true,
                params: {
                    chart: 'experience-per-skill'
                }
            }
        });
    }
    angular.module('superstarsApp').factory('Chart', ChartService);
})();
//# sourceMappingURL=../../components/services/chart.service.js.map
'use strict';

(function () {
  function PositionResource($resource) {
    return $resource('/api/positions', {}, {
      getPositions: {
        method: 'GET',
        isArray: true,
        cache: true
      }
    });
  }
  angular.module('superstarsApp').factory('Position', PositionResource);
})();
//# sourceMappingURL=../../components/services/position.service.js.map
'use strict';

(function () {
  function SkillResource($resource) {
    return $resource('/api/skills', {}, {
      getSkills: {
        method: 'GET',
        isArray: true,
        cache: true
      }
    });
  }
  angular.module('superstarsApp').factory('Skill', SkillResource);
})();
//# sourceMappingURL=../../components/services/skill.service.js.map
'use strict';

(function () {

  function UserResource($resource) {
    return $resource('/api/users/:username/:path/:id', {
      username: '@username',
      path: '@path'
    }, {
      getProfile: {
        method: 'GET',
        params: {
          username: 'username'
        }
      },
      getMyUser: {
        method: 'GET',
        params: {
          username: 'me'
        }
      },
      getAllUsers: {
        method: 'GET',
        params: {
          username: ''
        },
        isArray: true,
        cache: true
      },
      getUsers: {
        method: 'GET',
        params: {
          username: 'username'
        },
        isArray: true,
        cache: true
      },
      updateProfile: {
        method: 'PUT',
        params: {
          username: '@username',
          path: '@path',
          id: '@id'
        }
      },
      saveProfile: {
        method: 'POST',
        params: {
          username: '@username',
          path: '@path'
        }
      },
      deleteProfile: {
        method: 'DELETE',
        params: {
          username: '@username',
          path: '@path',
          id: '@id'
        }
      },
      deleteWholeProfile: {
        method: 'DELETE',
        params: {
          username: '@username'
        }
      }

    });
  }

  angular.module('superstarsApp.auth').factory('User', UserResource);
})();
//# sourceMappingURL=../../components/services/user.service.js.map
/* global io */
'use strict';

angular.module('superstarsApp').factory('socket', function (socketFactory) {
  // socket.io now auto-configures its connection when we ommit a connection url
  var ioSocket = io('', {
    // Send auth token on connection, you will need to DI the Auth service above
    // 'query': 'token=' + Auth.getToken()
    path: '/socket.io-client'
  });

  var socket = socketFactory({
    ioSocket: ioSocket
  });

  return {
    socket: socket,

    /**
     * Register listeners to sync an array with updates on a model
     *
     * Takes the array we want to sync, the model name that socket updates are sent from,
     * and an optional callback function after new items are updated.
     *
     * @param {String} modelName
     * @param {Array} array
     * @param {Function} cb
     */
    syncUpdates: function syncUpdates(modelName, array, cb) {
      cb = cb || angular.noop;

      /**
       * Syncs item creation/updates on 'model:save'
       */
      socket.on(modelName + ':save', function (item) {
        var oldItem = _.find(array, {
          _id: item._id
        });
        var index = array.indexOf(oldItem);
        var event = 'created';

        // replace oldItem if it exists
        // otherwise just add item to the collection
        if (oldItem) {
          array.splice(index, 1, item);
          event = 'updated';
        } else {
          array.push(item);
        }

        cb(event, item, array);
      });

      /**
       * Syncs removed items on 'model:remove'
       */
      socket.on(modelName + ':remove', function (item) {
        var event = 'deleted';
        _.remove(array, {
          _id: item._id
        });
        cb(event, item, array);
      });
    },


    /**
     * Removes listeners for a models updates on the socket
     *
     * @param modelName
     */
    unsyncUpdates: function unsyncUpdates(modelName) {
      socket.removeAllListeners(modelName + ':save');
      socket.removeAllListeners(modelName + ':remove');
    }
  };
});
//# sourceMappingURL=../../components/socket/socket.service.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

  function displayMenuItem(item, stateName) {
    return item.show === stateName || item.show === 'all';
  }

  var ListBottomSheetCtrl = function () {
    function ListBottomSheetCtrl(Util, $location, $mdBottomSheet, $state, $stateParams, Auth, $window) {
      _classCallCheck(this, ListBottomSheetCtrl);

      this.location = $location;
      this.state = $state;
      this.mdBottomSheet = $mdBottomSheet;
      this.stateParams = $stateParams;
      this.window = $window;
      var ctrl = this;
      Auth.getCurrentUser(function (user) {
        ctrl.items = Util.getMenuActionItems('ListBottomCtrl.stateParams.username', user.username);
      });
    }

    _createClass(ListBottomSheetCtrl, [{
      key: 'showMenuItem',
      value: function showMenuItem(item) {
        return displayMenuItem(item, this.state.current.name);
      }
    }, {
      key: 'listItemClick',
      value: function listItemClick($index) {
        var clickedItem = this.items[$index];
        this.location.path(clickedItem.path);
        this.mdBottomSheet.hide();
      }
    }, {
      key: 'openSubMenu',
      value: function openSubMenu($index) {
        var item = this.items[$index];
        item.openMenu = !item.openMenu;
      }
    }]);

    return ListBottomSheetCtrl;
  }();

  var ToolbarController = function () {
    function ToolbarController($mdSidenav, $mdBottomSheet, $stateParams, Auth, Util, $state) {
      _classCallCheck(this, ToolbarController);

      this.auth = Auth;
      this.state = $state;
      this.searchText = $stateParams.q;
      this.showMobileMainHeader = true;
      this.isLoggedIn = this.auth.isLoggedIn;
      this.mdSidenav = $mdSidenav;
      this.mdBottomSheet = $mdBottomSheet;
      this.stateParams = $stateParams;
      var ctrl = this;
      this.auth.getCurrentUser(function (user) {
        ctrl.items = Util.getMenuActionItems('toolbarCtrl.stateParams.username', user.username);
      });
    }

    _createClass(ToolbarController, [{
      key: 'showMenuItem',
      value: function showMenuItem(item) {
        return displayMenuItem(item, this.state.current.name) && (item.onlyAdmin ? this.stateParams.username === this.auth.getCurrentUser().username || this.auth.isAdmin() : true);
      }
    }, {
      key: 'setMobileMainHeader',
      value: function setMobileMainHeader(showStatusMobileHeader) {
        this.showMobileMainHeader = showStatusMobileHeader;
      }
    }, {
      key: 'checkLenghtAndUpdate',
      value: function checkLenghtAndUpdate() {
        var length = this.searchText.length;
        var query;
        if (length >= 3) {
          query = this.searchText;
        } else if (length === 0) {
          query = '';
        }
        this.state.go('main', {
          q: query
        });
      }
    }, {
      key: 'toggleSidenav',
      value: function toggleSidenav(menuId) {
        this.mdSidenav(menuId).toggle();
      }
    }, {
      key: 'showListBottomSheet',
      value: function showListBottomSheet($event) {
        this.mdBottomSheet.show({
          templateUrl: 'components/toolbar/listBottomMenu.html',
          controller: ListBottomSheetCtrl,
          controllerAs: 'ListBottomCtrl',
          targetEvent: $event
        });
      }
    }, {
      key: 'openButtonMenu',
      value: function openButtonMenu($index) {
        var item = this.items[$index];
        item.openMenu = !item.openMenu;
      }
    }]);

    return ToolbarController;
  }();

  angular.module('superstarsApp').component('toolbar', {
    templateUrl: 'components/toolbar/toolbar.html',
    controller: ToolbarController,
    controllerAs: 'toolbarCtrl'
  });
})();
//# sourceMappingURL=../../components/toolbar/toolbar.component.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var UserCardController = function () {
    function UserCardController(appConfig, $state) {
      _classCallCheck(this, UserCardController);

      this.config = appConfig;
      this.$state = $state;
    }

    _createClass(UserCardController, [{
      key: '$onInit',
      value: function $onInit() {
        var userSocial = this.user.social || {};
        this.socialUrls = {
          facebook: this.config.socialMedia.facebookUrl + (userSocial.facebook || ''),
          twitter: this.config.socialMedia.twitterUrl + (userSocial.twitter || ''),
          linkedIn: this.config.socialMedia.linkedInUrl + (userSocial.linkedIn || '')
        };

        this.positionsTooltip = this.user.positions.length > 0 ? this.user.positions.map(function (a) {
          return a.name;
        }).join(', ') : 'No role defined';
      }
    }, {
      key: 'click',
      value: function click() {
        if (this.newTab) {
          var url = this.$state.href('profile', { username: this.user.username });
          window.open(url, '_blank');
        } else {
          this.$state.go('profile', { username: this.user.username });
        }
      }
    }]);

    return UserCardController;
  }();

  angular.module('superstarsApp').component('userCard', {
    templateUrl: 'components/userCard/userCard.html',
    controller: UserCardController,
    bindings: {
      user: '<',
      newTab: '<'
    }
  });
})();
//# sourceMappingURL=../../components/userCard/userCard.component.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

  function loadMoreEventHandler() {
    /*
      https://jslinterrors.com/option-validthis-cant-be-used-in-a-global-scope
      This option suppresses warnings about possible strict violations
      when the code is running in strict mode and you use this in a non-constructor function.
      You should use this option—in a function scope only—when you are positive
      that your use of this is valid in the strict mode
      (for example, if you call your function using Function.call).
    */
    /*jshint validthis: true */
    if (this.usersShown.length <= this.users.length) {
      var addedUsers = this.users.slice(this.usersShown.length, this.usersToShow + this.usersShown.length);
      this.usersShown = this.usersShown.concat(addedUsers);
    }
  }

  var UserListController = function () {
    function UserListController(User, $stateParams, $timeout) {
      _classCallCheck(this, UserListController);

      this.UserService = User;
      this.query = $stateParams.q;
      this.users = [];
      this.usersShown = [];
      this.usersToShow = 16;
      this.loaded = false;
      this.eventHandler = loadMoreEventHandler.bind(this);
      this.timeout = $timeout;
    }

    _createClass(UserListController, [{
      key: '$onInit',
      value: function $onInit() {
        var resource = this.UserService.getAllUsers({ q: this.query });
        resource.$promise.then(this.loadUser.bind(this));
      }
    }, {
      key: 'loadUser',
      value: function loadUser(data) {
        var that = this;
        //using timeout due to an issue on infinite scroll lib
        this.timeout(function () {
          that.users = data;
          that.usersShown = that.users.slice(0, that.usersToShow);
          that.loaded = true;
        }, 0);
      }
    }]);

    return UserListController;
  }();

  angular.module('superstarsApp').component('userList', {
    templateUrl: 'components/userList/userList.html',
    controller: UserListController
  });
})();
//# sourceMappingURL=../../components/userList/userList.component.js.map
'use strict';

(function () {

  /**
   * The Util service is for thin, globally reusable, utility functions
   */
  function UtilService($window) {
    var Util = {

      /**
       * Return the menu action items
       *
       * @param  {}
       * @return {array of elements}
       */
      getMenuActionItems: function getMenuActionItems(username, loggedUser) {
        return [{
          name: 'Home',
          icon: 'home',
          sref: 'main',
          show: 'all',
          target: ''
        }, {
          name: 'Charts',
          icon: 'trending_up',
          sref: 'chart()',
          show: 'all',
          onlyAdmin: true,
          target: ''
        }, {
          name: 'My Profile',
          icon: 'account_circle',
          sref: 'profile({ username: \'' + loggedUser + '\'})',
          show: 'all',
          target: ''
        }, {
          name: 'Export Profile',
          icon: 'launch',
          show: 'profile',
          onlyAdmin: true,
          hasOptions: true,
          menuOptions: [{
            icon: '<img src="../../assets/images/docx-icon-02336285f3.svg" height="15" />',
            label: 'Export to DOCX',
            link: 'exportprofile({ username: ' + username + ', to: \'doc\'})'
          }]
        }, {
          name: 'Public Profile',
          icon: 'public',
          sref: 'publicprofile({ username: ' + username + '})',
          show: 'profile',
          target: '_blank'
        }];
      },


      /**
       * Return a callback or noop function
       *
       * @param  {Function|*} cb - a 'potential' function
       * @return {Function}
       */
      safeCb: function safeCb(cb) {
        return angular.isFunction(cb) ? cb : angular.noop;
      },


      /**
       * Parse a given url with the use of an anchor element
       *
       * @param  {String} url - the url to parse
       * @return {Object}     - the parsed url, anchor element
       */
      urlParse: function urlParse(url) {
        var a = document.createElement('a');
        a.href = url;

        // Special treatment for IE, see http://stackoverflow.com/a/13405933 for details
        if (a.host === '') {
          a.href = a.href;
        }

        return a;
      },


      /**
       * Test whether or not a given url is same origin
       *
       * @param  {String}           url       - url to test
       * @param  {String|String[]}  [origins] - additional origins to test against
       * @return {Boolean}                    - true if url is same origin
       */
      isSameOrigin: function isSameOrigin(url, origins) {
        url = Util.urlParse(url);
        origins = origins && [].concat(origins) || [];
        origins = origins.map(Util.urlParse);
        origins.push($window.location);
        origins = origins.filter(function (o) {
          var hostnameCheck = url.hostname === o.hostname;
          var protocolCheck = url.protocol === o.protocol;
          // 2nd part of the special treatment for IE fix (see above): 
          // This part is when using well-known ports 80 or 443 with IE,
          // when $window.location.port==='' instead of the real port number.
          // Probably the same cause as this IE bug: https://goo.gl/J9hRta
          var portCheck = url.port === o.port || o.port === '' && (url.port === '80' || url.port === '443');
          return hostnameCheck && protocolCheck && portCheck;
        });
        return origins.length >= 1;
      }
    };

    return Util;
  }

  angular.module('superstarsApp.util').factory('Util', UtilService);
})();
//# sourceMappingURL=../../components/util/util.service.js.map
angular.module("superstarsApp").run(["$templateCache", function($templateCache) {$templateCache.put("app/chart/chart.html","<md-content><div layout=\"column\" layout-wrap=\"layout-wrap\" flex=\"flex\" class=\"container\"><md-card-title><md-card-title-text><span class=\"md-headline\">Charts</span></md-card-title-text></md-card-title><md-card-content layout=\"row\"><div layout=\"column\" flex=\"10\"><md-input-container><label>Chart Type</label><md-select ng-model=\"$ctrl.selectedChart\" required=\"required\" class=\"dropdown\">           <md-option ng-repeat=\"type in $ctrl.chartTypes\" ng-value=\"type\">{{type}}      </md-option></md-select></md-input-container><md-checkbox ng-model=\"$ctrl.bench\" aria-label=\"Only bench\" class=\"checkbox\">Only bench</md-checkbox><md-checkbox ng-model=\"$ctrl.topResults\" aria-label=\"Top results\" ng-show=\"$ctrl.isChartPerTotal()\" class=\"checkbox\">Top results</md-checkbox><md-input-container ng-show=\"$ctrl.topResults &amp;&amp; $ctrl.isChartPerTotal()\" class=\"md-block\"><label>Number of Results</label><input type=\"number\" ng-model=\"$ctrl.numberResults\" min=\"1\" max=\"200\" required=\"required\"/></md-input-container><md-chips ng-model=\"$ctrl.selectedSkills\" md-autocomplete-snap=\"\" md-require-match=\"true\" layout=\"row\"><md-autocomplete md-selected-item=\"$ctrl.selectedItem\" md-search-text=\"$ctrl.searchText\" md-items=\"item in $ctrl.querySearch($ctrl.searchText)\" md-item-text=\"item.name\" placeholder=\"Search for a skill\"><span md-highlight-text=\"$ctrl.searchText\">{{item.name}}</span></md-autocomplete><md-chip-template><span><strong>{{$chip.name}}</strong></span></md-chip-template></md-chips><md-switch ng-model=\"$ctrl.sort\" aria-label=\"Sort descending\" ng-show=\"$ctrl.isChartPerTotal()\">Sort Desc.	  </md-switch><md-button ng-click=\"$ctrl.generateChart()\" class=\"md-raised md-primary\">Generate Chart</md-button></div><div layout=\"column\" flex=\"90\" class=\"chart-container\"> <canvas id=\"bar\" chart-series=\"$ctrl.series\" chart-data=\"$ctrl.data\" chart-labels=\"$ctrl.labels\" chart-options=\"$ctrl.chartOptions\" ng-hide=\"$ctrl.noResults\" chart-click=\"$ctrl.selectUsers\" class=\"chart chart-bar\"></canvas><md-toolbar ng-show=\"$ctrl.noResults\"> <div class=\"md-toolbar-tools\"><h2 class=\"md-flex\">No results</h2></div></md-toolbar></div></md-card-content><div md-scroll-y=\"md-scroll-y\" layout=\"row\" layout-wrap=\"layout-wrap\" flex=\"flex\"><user-card ng-repeat=\"user in $ctrl.userList\" flex-xs=\"100\" flex-sm=\"50\" flex=\"25\" user=\"user\" new-tab=\"true\"></user-card></div></div></md-content>");
$templateCache.put("app/main/main.html","<user-list layout=\"column\" flex=\"flex\"></user-list>");
$templateCache.put("app/profile/profile.html","<md-content md-scroll-y=\"md-scroll-y\"><profile-admin-bar user=\"$ctrl.user\" on-update=\"$ctrl.updateSimpleField(path, value)\" delete-profile=\"$ctrl.deleteProfile()\" ng-show=\"$ctrl.Auth.isAdmin() &amp;&amp; !$ctrl.hideSection\"></profile-admin-bar><div layout=\"column\" layout-wrap=\"layout-wrap\" flex=\"flex\" id=\"superstars-profile\" class=\"container\"><top-bar user=\"$ctrl.user\" read-only=\"$ctrl.readOnly\" test=\"$ctrl.save\" on-save=\"$ctrl.save(path, object, field)\" on-delete=\"$ctrl.delete(path, id)\" flex=\"flex\"></top-bar><div layout=\"row\" layout-xs=\"column\" layout-sm=\"column\" class=\"profile-details flex\"><div layout=\"column\" flex=\"flex\" class=\"profile-column left\"><profile-contacts user=\"$ctrl.user\" on-update=\"$ctrl.updateSimpleField(path, value)\" read-only=\"$ctrl.readOnly\" ng-hide=\"$ctrl.hideSection\"></profile-contacts><profile-about-me user=\"$ctrl.user\" on-update=\"$ctrl.updateSimpleField(path, value)\" read-only=\"$ctrl.readOnly\"></profile-about-me><profile-qualification-summary user=\"$ctrl.user\" on-update=\"$ctrl.updateSimpleField(path, value)\" read-only=\"$ctrl.readOnly\"></profile-qualification-summary><profile-skills user=\"$ctrl.user\" on-update=\"$ctrl.updateComplexField(path, object)\" on-save=\"$ctrl.save(path, object, field)\" on-delete=\"$ctrl.delete(path, id)\" read-only=\"$ctrl.readOnly\"></profile-skills><profile-languages user=\"$ctrl.user\" on-update=\"$ctrl.updateComplexField(path, object)\" on-save=\"$ctrl.save(path, object, field)\" on-delete=\"$ctrl.delete(path, id)\" read-only=\"$ctrl.readOnly\"></profile-languages></div><div layout=\"column\" flex=\"none\" class=\"profile-column right\"><profile-educations items=\"$ctrl.user.education\" on-update=\"$ctrl.updateComplexField(path, object)\" on-save=\"$ctrl.save(path, object, field)\" on-delete=\"$ctrl.delete(path, id)\" read-only=\"$ctrl.readOnly\"></profile-educations><profile-certifications items=\"$ctrl.user.certifications\" on-update=\"$ctrl.updateComplexField(path, object)\" on-save=\"$ctrl.save(path, object, field)\" on-delete=\"$ctrl.delete(path, id)\" read-only=\"$ctrl.readOnly\"></profile-certifications><profile-working-experiences items=\"$ctrl.user.experiences\" on-update=\"$ctrl.updateComplexField(path, object)\" on-save=\"$ctrl.save(path, object, field)\" on-delete=\"$ctrl.delete(path, id)\" read-only=\"$ctrl.readOnly\"></profile-working-experiences><profile-hobbies user=\"$ctrl.user\" on-save=\"$ctrl.save(path, object, field)\" on-delete=\"$ctrl.delete(path, id)\" read-only=\"$ctrl.readOnly\"></profile-hobbies></div></div></div></md-content>");
$templateCache.put("components/footer/footer.html","<div class=\"container\"><p>Angular Fullstack v3.7.5 | <a href=\"https://twitter.com/tyhenkel\">@tyhenkel</a> | <a href=\"https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open\">Issues</a></p></div>");
$templateCache.put("components/navbar/navbar.html","<md-toolbar><div layout=\"column\" layout-align=\"center center\" ng-show=\"nav.isLoggedIn()\" class=\"inset\"> <a ng-href=\" {{nav.UserProfileLink}}\"><img src=\"{{ nav.currentUser.picture }}\" alt=\"{{nav.currentUser.picture}}\" class=\"avatar-picture\"/></a><a ng-href=\"{{nav.UserProfileLink}}\"><div id=\"user-name-on-navbar\">{{ nav.currentUser.name | uppercase}}</div></a></div><div layout=\"column\" layout-align=\"center center\" ng-hide=\"nav.isLoggedIn()\" class=\"inset unsigned-user-toolbar\"> <i class=\"material-icons\">account_circle</i><oauth-buttons></oauth-buttons></div></md-toolbar><md-divider>  </md-divider><md-content flex=\"flex\"><md-list class=\"md-dense\"><md-list-item class=\"md-2-line active-link\"><md-button id=\"sup-j-navbar-superstars\" ui-sref=\"{{nav.SuperstarsLink}}\" ng-click=\"nav.SuperstarsLink\"><i class=\"material-icons\">star</i><span class=\"text-icon\">SUPERSTARS</span></md-button></md-list-item><md-list-item class=\"md-2-line\"><a id=\"sup-j-navbar-acdc\" href=\"{{nav.ACDCLink}}\" target=\"_blank\"><i class=\"material-icons\">date_range</i>ACDC</a></md-list-item><md-list-item class=\"md-2-line\"><a id=\"sup-j-navbar-academy\" href=\"{{nav.AcademyLink}}\" target=\"_blank\"><i class=\"material-icons\">school</i>ACADEMY</a></md-list-item><md-list-item class=\"md-2-line\"><a id=\"sup-j-navbar-miles\" href=\"{{nav.MilesLink}}\" target=\"_blank\"><i class=\"material-icons\">account_balance_wallet</i>MILES</a></md-list-item><md-list-item class=\"md-2-line\"><a id=\"sup-j-navbar-acpm\" href=\"{{nav.ACPMLink}}\" target=\"_blank\"><i class=\"material-icons\">assessment</i>ACPM</a></md-list-item></md-list></md-content><div ng-show=\"nav.isLoggedIn()\"> <md-divider class=\"bottom-divider\"></md-divider><md-content class=\"bottom-content\"><div class=\"logout-container\"><md-button id=\"navbar-logout-button\" ng-href=\"/logout\" class=\"md-raised\">Logout</md-button></div></md-content></div>");
$templateCache.put("components/oauth-buttons/oauth-buttons.html","<md-button id=\"navbar-login-button\" ng-click=\"OauthButtons.loginOauth(&quot;google&quot;)\" class=\"md-raised md-primary\">Login</md-button>");
$templateCache.put("components/scrollTopButton/scrollTopButton.html","<md-button ng-click=\"$ctrl.goTop()\" class=\"md-fab md-primary\"><i id=\"arrow-up\" class=\"material-icons\">arrow_upward</i></md-button>");
$templateCache.put("components/toolbar/listBottomMenu.html","<md-bottom-sheet id=\"bottom-menu\" ng-cloak=\"ng-cloak\" class=\"md-list md-has-header\"><md-list><div ng-repeat=\"item in ListBottomCtrl.items\" ng-show=\"ListBottomCtrl.showMenuItem(item)\"><md-list-item><md-button ng-if=\"!item.hasOptions\" ng-click=\"ListBottomCtrl.listItemClick($index)\" class=\"md-list-item-content\"><a ui-sref=\"{{item.sref}}\" ng-click=\"item.sref\" ui-sref-active=\"active\"><i class=\"material-icons\">{{item.icon}}</i><span class=\"md-inline-list-icon-label\">{{ item.name | translate }}</span></a></md-button><md-button ng-if=\"item.hasOptions\" ng-click=\"ListBottomCtrl.openSubMenu($index)\" class=\"md-list-item-content\"><i class=\"material-icons\">{{item.icon}}</i><span class=\"md-inline-list-icon-label\">{{ item.name | translate }}</span></md-button></md-list-item><md-list-item ng-if=\"item.hasOptions &amp;&amp; item.openMenu\" ng-repeat=\"menu in item.menuOptions\" class=\"sub-menu-bottom\"><md-button class=\"md-list-item-content\"><a href=\"{{menu.link}}\" target=\"_blank\"><div layout=\"row\"><div ng-bind-html=\"menu.icon\"></div><span class=\"md-inline-list-icon-label\">{{menu.label}}</span></div></a></md-button></md-list-item></div></md-list></md-bottom-sheet>");
$templateCache.put("components/toolbar/toolbar.html","<md-toolbar ng-show=\"!toolbarCtrl.isLoggedIn()\" class=\"animate-show\"><div class=\"md-toolbar-tools\"><md-button ng-click=\"toolbarCtrl.toggleSidenav(\'left\')\" aria-label=\"Menu\" class=\"md-icon-button\"><i class=\"material-icons\">menu</i></md-button></div></md-toolbar><md-toolbar ng-show=\"toolbarCtrl.isLoggedIn()\" class=\"animate-show md-whiteframe-z1\"><div data-ng-show=\"toolbarCtrl.showMobileMainHeader\" class=\"md-toolbar-tools\"><md-button ng-click=\"toolbarCtrl.toggleSidenav(\'left\')\" aria-label=\"Menu\" class=\"md-icon-button\"><i class=\"material-icons\">menu</i></md-button><i hide-xs=\"hide-xs\" class=\"material-icons\">search</i><span flex=\"flex\" hide-xs=\"hide-xs\"><md-input-container md-no-float=\"\"><input id=\"sup-j-toolBar-searchField\" placeholder=\"Search for people\" ng-model=\"toolbarCtrl.searchText\" ng-model-options=\"{debounce:180}\" ng-change=\"toolbarCtrl.checkLenghtAndUpdate()\" type=\"text\"/></md-input-container></span><div hide-xs=\"hide-xs\" hide-sm=\"hide-sm\" ng-repeat=\"item in toolbarCtrl.items\" ng-show=\"toolbarCtrl.showMenuItem(item)\" class=\"button-container\"><md-button ng-if=\"!item.hasOptions\" aria-label=\"{{ buttom.name | translate }}\" target=\"{{item.target}}\" ui-sref=\"{{item.sref}}\" ng-click=\"item.sref\" id=\"sup-profile-{{ item.name.split(\' \').join(\'\') }}\" ui-sref-active=\"active\"><i class=\"material-icons\">{{item.icon}}</i><span class=\"text-icon\">{{ item.name | translate }}</span></md-button><md-button ng-if=\"item.hasOptions\" aria-label=\"{{ buttom.name | translate }}\" ng-click=\"toolbarCtrl.openButtonMenu($index)\" id=\"sup-profile-{{ item.name.split(\' \').join(\'\') }}\"><i class=\"material-icons\">{{item.icon}}</i><span class=\"text-icon\">{{ item.name | translate }}</span></md-button><div hide-on-click-window=\"hide-on-click-window\" rule=\"{{toolbarCtrl.items[$index].openMenu}}\" ng-if=\"item.hasOptions\" class=\"menu-content md-whiteframe-4dp\"><div ng-repeat=\"menu in toolbarCtrl.items[$index].menuOptions\" class=\"menu-itens\"><a href=\"#\" ui-sref=\"{{menu.link}}\" target=\"_blank\"><div layout=\"row\"><div ng-bind-html=\"menu.icon\"></div><div class=\"menu-label\">{{menu.label}}</div></div></a></div></div></div><span flex=\"\" hide-gt-xs=\"\">      </span><md-button aria-label=\"Search\" hide-gt-xs=\"\" data-ng-click=\"toolbarCtrl.setMobileMainHeader(false)\" class=\"md-icon-button\"><i class=\"material-icons\">search</i></md-button><md-button aria-label=\"More\" hide-gt-sm=\"hide-gt-sm\" ng-click=\"toolbarCtrl.showListBottomSheet()\" class=\"md-icon-button\"><i class=\"material-icons\">more_vert</i></md-button></div><div hide-gt-xs=\"hide-gt-xs\" data-ng-hide=\"toolbarCtrl.showMobileMainHeader\" class=\"md-toolbar-tools\"><md-button aria-label=\"Back\" data-ng-click=\"toolbarCtrl.setMobileMainHeader(true)\" class=\"md-icon-button\"><i class=\"material-icons\">arrow_back</i></md-button><div md-no-float=\"md-no-float\" style=\"padding-bottom:0px;\" class=\"custom-input-container md-accent\"><span flex=\"flex\"><md-input-container md-no-float=\"\"><input id=\"sup-j-toolBar-searchField\" placeholder=\"Search\" ng-model=\"toolbarCtrl.searchText\" ng-model-options=\"{debounce:180}\" ng-change=\"toolbarCtrl.checkLenghtAndUpdate()\" type=\"text\"/></md-input-container></span></div></div></md-toolbar>");
$templateCache.put("components/userCard/userCard.html","<div id=\"sup-j-userCard\" ng-click=\"$ctrl.click()\" layout=\"column\" layout-align=\"none center\" class=\"container\"> <img ng-src=\"{{$ctrl.user.picture}}\" alt=\"\" class=\"user-avatar\"/><div class=\"user-name\">{{$ctrl.user.name}}</div><div class=\"user-position\"><md-tooltip md-direction=\"bottom\">{{ $ctrl.positionsTooltip }}</md-tooltip><p ng-show=\"$ctrl.user.positions.length === 0\" class=\"position\">{{ $ctrl.positionsTooltip }}</p><p ng-show=\"$ctrl.user.positions.length === 1\" class=\"position\">{{ $ctrl.user.positions[0].name }}</p><p ng-show=\"$ctrl.user.positions.length &gt; 1\" class=\"position\">{{ $ctrl.user.positions[0].name }} and others</p></div><div class=\"user-email\"><md-tooltip md-direction=\"bottom\">{{$ctrl.user.email}}</md-tooltip><div class=\"user-email-text\">{{$ctrl.user.email}}</div></div><div layout=\"row\" layout-align=\"center center\" class=\"actions\"><div ng-show=\"$ctrl.user.social.facebook\" class=\"action facebook\"><md-tooltip md-direction=\"bottom\">{{$ctrl.user.social.facebook}}</md-tooltip><a ng-href=\"{{$ctrl.socialUrls.facebook}}\" target=\"_blank\"><i class=\"fa fa-facebook-square\"></i></a></div><div ng-show=\"$ctrl.user.social.twitter\" class=\"action twitter\"><md-tooltip md-direction=\"bottom\">{{$ctrl.user.social.twitter}}</md-tooltip><a ng-href=\"{{$ctrl.socialUrls.twitter}}\" target=\"_blank\"><i aria-hidden=\"true\" class=\"fa fa-twitter\"></i></a></div><div ng-show=\"$ctrl.user.social.skype\" class=\"action skype\"><md-tooltip md-direction=\"bottom\">{{$ctrl.user.social.skype}}</md-tooltip><i aria-hidden=\"true\" class=\"fa fa-skype\"></i></div><div ng-show=\"$ctrl.user.social.linkedIn\" class=\"action linkedIn\"><md-tooltip md-direction=\"bottom\">{{$ctrl.user.social.linkedIn}}</md-tooltip><a ng-href=\"{{$ctrl.socialUrls.linkedIn}}\" target=\"_blank\"><i aria-hidden=\"true\" class=\"fa fa-linkedin\"></i></a></div></div></div>");
$templateCache.put("components/userList/userList.html","<md-content layout=\"column\" flex=\"flex\" layout-align=\"center center\" ng-hide=\"!$ctrl.loaded || $ctrl.usersShown.length\" class=\"no-results ng-hide\"><div class=\"icon-sad\">:(</div><div class=\"message\">Sorry! No results for: \"{{$ctrl.query}}\"</div></md-content><md-content md-scroll-y=\"md-scroll-y\" layout=\"row\" layout-wrap=\"layout-wrap\" flex=\"flex\" z-infinite-scroll=\"$ctrl.eventHandler\" scroll-threshold=\"300\" time-threshold=\"0\" ng-show=\"$ctrl.usersShown.length\" id=\"user-cards-content\"><user-card ng-repeat=\"user in $ctrl.usersShown\" flex-xs=\"100\" flex-sm=\"50\" flex=\"25\" user=\"user\"></user-card><scroll-top-button parent-id=\"user-cards-content\" min-height=\"304\" miliseconds=\"1000\"></scroll-top-button></md-content>");
$templateCache.put("app/account/login/login.html","<div layout=\"column\" layout-align=\"center center\" flex=\"flex\" class=\"oauth-button-container\"><div layout=\"column\" layout-align=\"center center\" layout-wrap=\"layout-wrap\" flex=\"flex\"><img alt=\"Avenue Code Superstars\" src=\"assets/images/main_logo-c45f76e722.png\" class=\"img-responsive text-center\"/><p id=\"non-ac-account-login-msg\">You need to have an Avenue Code account to access this application.</p><p class=\"error\">{{ serverMessage }}</p><oauth-buttons classes=\"btn-block\"></oauth-buttons></div></div>");
$templateCache.put("components/profile/aboutMe/aboutMe.html","<profile-tile title=\"About me\" icon=\"person_outline\" on-help=\"$ctrl.help($event)\" profile-tile-locker-id=\"$ctrl.profileTileLockerId\" locked=\"$ctrl.locked\" read-only=\"$ctrl.readOnly\"><md-input-container class=\"md-block\"><textarea id=\"sup-j-profile-aboutMe\" ng-model=\"$ctrl.user.aboutMe\" ng-if=\"$ctrl.readOnly\" readonly=\"$ctrl.readOnly\" ng-change=\"$ctrl.update()\" ng-model-options=\"{updateOn: \'default blur\', debounce:{ \'default\': 1500, \'blur\': 0}}\" aria-label=\"About me\" class=\"about-me\"></textarea><textarea id=\"sup-j-profile-aboutMe\" ng-model=\"$ctrl.user.aboutMe\" ng-if=\"!$ctrl.readOnly\" ng-change=\"$ctrl.update()\" ng-model-options=\"{updateOn: \'default blur\', debounce:{ \'default\': 1500, \'blur\': 0}}\" aria-label=\"About me\" class=\"about-me\"></textarea></md-input-container></profile-tile>");
$templateCache.put("components/profile/adminBar/adminBar.html","<div layout=\"row\" layout-align=\"space-between center\" layout-wrap=\"layout-wrap\" flex=\"flex\" class=\"admin-bar\"><div class=\"bench\"><md-switch md-no-ink=\"md-no-ink\" aria-label=\"Switch No Ink\" ng-model=\"$ctrl.user.onBench\" ng-change=\"$ctrl.update()\" class=\"md-primary\">User on bench</md-switch></div><div class=\"timestamp\">Last time edited: {{ $ctrl.user.updatedAt | date: \'MM/dd/yyyy - HH:mm\'}}</div><div class=\"delete\"><md-button ng-click=\"$ctrl.delete()\" class=\"md-raised\">Delete Profile</md-button></div></div>");
$templateCache.put("components/profile/certification/certification.html","<div id=\"sup-j-profile-certification-{{ $ctrl.model.name.split(\' \').join(\'\') }}\" ng-hide=\"$ctrl.editing\" ng-click=\"$ctrl.edit()\" class=\"details\"><h1><span class=\"certification-name\">{{$ctrl.model.name}}</span></h1><div class=\"certification-dates\"><span>From:&nbsp;</span><span class=\"certification-start-date\">{{$ctrl.model.startDate | date: \'yyyy\'}}</span><span ng-show=\"$ctrl.model.endDate\">&nbsp;&nbsp;&nbsp;To:&nbsp;</span><span ng-show=\"$ctrl.model.endDate\" class=\"certification-end-date\">{{$ctrl.model.endDate | date: \'yyyy\'}}</span></div><div class=\"certification-authority\">{{$ctrl.model.authority}}</div></div><form name=\"editForm\" ng-if=\"$ctrl.editing\" ng-submit=\"$ctrl.update(editForm)\" novalidate=\"novalidate\"><md-input-container class=\"md-block\"><label>Certification Name</label><input id=\"sup-j-certification-name\" ng-model=\"$ctrl.model.name\" autofocus=\"autofocus\" required=\"required\" name=\"certificationName\" class=\"certification-name\"/><div ng-messages=\"editForm.certificationName.$error\"><div ng-message=\"required\">Certification Name cannot be empty</div></div></md-input-container><md-input-container class=\"md-block\"><label>Certification Authority</label><input id=\"sup-j-certification-authority\" ng-model=\"$ctrl.model.authority\" required=\"required\" name=\"certificationAuthority\" class=\"certification-authority\"/><div ng-messages=\"editForm.certificationAuthority.$error\"><div ng-message=\"required\">Certification Authority cannot be empty	</div></div></md-input-container><div layout=\"row\"><md-input-container flex=\"50\"><label>Start Date</label><md-datepicker id=\"sup-j-certification-startDate\" ng-model=\"$ctrl.model.startDate\" md-hide-icons=\"calendar\" name=\"startDate\" required=\"required\" md-max-date=\"$ctrl.currentDate\" md-open-on-focus=\"md-open-on-focus\" class=\"certification-start-date\"></md-datepicker><div ng-messages=\"editForm.startDate.$error\"><div ng-message=\"required\">Start Date cannot be empty</div><div ng-message=\"valid\">Start Date must be a valid date</div><div ng-message=\"maxdate\">Start Date must be less than today</div></div></md-input-container><md-input-container ng-show=\"$ctrl.certificationExpires\" class=\"flex\"><label>End Date</label><md-datepicker id=\"sup-j-certification-endDate\" ng-model=\"$ctrl.model.endDate\" ng-required=\"$ctrl.certificationExpires\" md-hide-icons=\"calendar\" name=\"endDate\" md-min-date=\"$ctrl.model.startDate\" md-open-on-focus=\"md-open-on-focus\" class=\"certification-end-date\"></md-datepicker><div ng-messages=\"editForm.endDate.$error\"><div ng-message=\"required\">End Date cannot be empty</div><div ng-message=\"valid\">End Date must be a valid date</div><div ng-message=\"mindate\">End Date should be greater than Start Date</div></div></md-input-container></div><md-checkbox id=\"sup-j-certification-checkBox\" ng-checked=\"$ctrl.certificationExpires\" ng-click=\"$ctrl.toggle()\" class=\"certification-expires\">This certification expires.</md-checkbox><md-button id=\"sup-j-certification-save\" type=\"submit\" class=\"profile-button md-raised md-primary\">Save</md-button><md-button id=\"sup-j-certification-cancel\" ng-mousedown=\"$ctrl.cancel(editForm)\" class=\"profile-button md-raised md-secondary\">Cancel</md-button></form>");
$templateCache.put("components/profile/certifications/certifications.html","<profile-timeline-tile title=\"Certification\" icon=\"book\" on-help=\"$ctrl.help($event)\" on-add-item=\"$ctrl.addItem()\" show-add-button=\"{{!$ctrl.readOnly}}\" add-button-flex=\"true\" add-button-enabled=\"!$ctrl.isInEditMode()\" profile-tile-locker-id=\"$ctrl.profileTileLockerId\" limit-items-mobile=\"$ctrl.limitTo\" items-length=\"$ctrl.items.length\" max-items-mobile=\"$ctrl.limitMobile\" locked=\"$ctrl.locked\" read-only=\"$ctrl.readOnly\"><profile-timeline-item ng-repeat=\"certification in $ctrl.items | limitTo: $ctrl.limitTo\" blocked=\"$ctrl.isBlocked(certification)\" fixed-remove-icon=\"$ctrl.isEditing(certification)\" on-remove=\"$ctrl.removeItem(certification)\" read-only=\"$ctrl.readOnly\" year=\"{{certification.startDate | date:\'yyyy\'}}\"><profile-certification certification=\"certification\" editing=\"$ctrl.isEditing(certification)\" on-cancel=\"$ctrl.cancelItem(certification)\" on-edit=\"$ctrl.editItem(certification)\" on-update=\"$ctrl.updateItem(certification)\" read-only=\"$ctrl.readOnly\"></profile-certification></profile-timeline-item></profile-timeline-tile>");
$templateCache.put("components/profile/contacts/contacts.html","<profile-tile title=\"Contact\" icon=\"smartphone\" on-help=\"$ctrl.help($event)\" profile-tile-locker-id=\"$ctrl.profileTileLockerId\" locked=\"$ctrl.locked\" read-only=\"$ctrl.readOnly\"><div class=\"profile-contact\"><md-input-container class=\"md-icon-float md-block\"><md-icon md-font-icon=\"fa-linkedin\" class=\"fa\"></md-icon><input ng-if=\"$ctrl.readOnly\" readonly=\"$ctrl.readOnly\" ng-change=\"$ctrl.update(\'linkedIn\')\" ng-model-options=\"{updateOn: \'default blur\', debounce:{\'default\': 1500, \'blur\': 0}}\" class=\"linkedin\" id=\"sup-j-profile-contact-in\" ng-model=\"$ctrl.user.social.linkedIn\" aria-label=\"LinkedIn\"/><input ng-if=\"!$ctrl.readOnly\" ng-change=\"$ctrl.update(\'linkedIn\')\" ng-model-options=\"{updateOn: \'default blur\', debounce:{\'default\': 1500, \'blur\': 0}}\" class=\"linkedin\" id=\"sup-j-profile-contact-in\" ng-model=\"$ctrl.user.social.linkedIn\" aria-label=\"LinkedIn\"/></md-input-container></div><div class=\"profile-contact\"><md-input-container class=\"md-icon-float md-block\"><md-icon md-font-icon=\"fa-facebook\" class=\"fa\"></md-icon><input ng-if=\"$ctrl.readOnly\" readonly=\"$ctrl.readOnly\" ng-change=\"$ctrl.update(\'facebook\')\" ng-model-options=\"{updateOn: \'default blur\', debounce:{\'default\': 1500, \'blur\': 0}}\" class=\"facebook\" id=\"sup-j-profile-contact-fb\" ng-model=\"$ctrl.user.social.facebook\" aria-label=\"Facebook\"/><input ng-if=\"!$ctrl.readOnly\" ng-change=\"$ctrl.update(\'facebook\')\" ng-model-options=\"{updateOn: \'default blur\', debounce:{\'default\': 1500, \'blur\': 0}}\" class=\"facebook\" id=\"sup-j-profile-contact-fb\" ng-model=\"$ctrl.user.social.facebook\" aria-label=\"Facebook\"/></md-input-container></div><div class=\"profile-contact\"><md-input-container class=\"md-icon-float md-block\"><md-icon md-font-icon=\"fa-twitter\" class=\"fa\"></md-icon><input ng-if=\"$ctrl.readOnly\" readonly=\"$ctrl.readOnly\" ng-change=\"$ctrl.update(\'twitter\')\" ng-model-options=\"{updateOn: \'default blur\', debounce:{\'default\': 1500, \'blur\': 0}}\" class=\"twitter\" id=\"sup-j-profile-contact-tw\" ng-model=\"$ctrl.user.social.twitter\" aria-label=\"Twitter\"/><input ng-if=\"!$ctrl.readOnly\" ng-change=\"$ctrl.update(\'twitter\')\" ng-model-options=\"{updateOn: \'default blur\', debounce:{\'default\': 1500, \'blur\': 0}}\" class=\"twitter\" id=\"sup-j-profile-contact-tw\" ng-model=\"$ctrl.user.social.twitter\" aria-label=\"Twitter\"/></md-input-container></div><div class=\"profile-contact\"><md-input-container class=\"md-icon-float md-block\"><md-icon md-font-icon=\"fa-skype\" class=\"fa\"></md-icon><input ng-if=\"$ctrl.readOnly\" readonly=\"$ctrl.readOnly\" ng-change=\"$ctrl.update(\'skype\')\" ng-model-options=\"{updateOn: \'default blur\', debounce:{\'default\': 1500, \'blur\': 0}}\" class=\"skype\" id=\"sup-j-profile-contact-sk\" ng-model=\"$ctrl.user.social.skype\" aria-label=\"Skype\"/><input ng-if=\"!$ctrl.readOnly\" ng-change=\"$ctrl.update(\'skype\')\" ng-model-options=\"{updateOn: \'default blur\', debounce:{\'default\': 1500, \'blur\': 0}}\" class=\"skype\" id=\"sup-j-profile-contact-sk\" ng-model=\"$ctrl.user.social.skype\" aria-label=\"Skype\"/></md-input-container></div><div class=\"profile-contact\"><md-input-container class=\"md-icon-float md-block\"><md-icon md-font-icon=\"fa-envelope\" class=\"fa\"></md-icon><input ng-if=\"$ctrl.readOnly\" readonly=\"true\" ng-change=\"$ctrl.update(\'undefined\')\" ng-model-options=\"{updateOn: \'default blur\', debounce:{\'default\': 1500, \'blur\': 0}}\" class=\"email\" id=\"sup-j-profile-contact-email\" ng-model=\"$ctrl.user.email\" aria-label=\"Email\"/><input ng-if=\"!$ctrl.readOnly\" ng-change=\"$ctrl.update(\'undefined\')\" ng-model-options=\"{updateOn: \'default blur\', debounce:{\'default\': 1500, \'blur\': 0}}\" class=\"email\" id=\"sup-j-profile-contact-email\" ng-model=\"$ctrl.user.email\" aria-label=\"Email\" readonly=\"true\"/></md-input-container></div></profile-tile>");
$templateCache.put("components/profile/education/education.html","<div id=\"sup-j-profile-education-{{ $ctrl.model.field.split(\' \').join(\'\') }}\" ng-hide=\"$ctrl.editing\" ng-click=\"$ctrl.edit()\" class=\"details\"><h1><span class=\"education-degree\">{{$ctrl.model.degree}}</span> degree in <span class=\"education-field\">{{$ctrl.model.field}}</span> at <span class=\"education-name\">{{$ctrl.model.school}}</span></h1><div class=\"education-dates\"><span>From:&nbsp;</span><span class=\"education-start-date\">{{$ctrl.model.startDate | date: \'yyyy\'}}</span><span ng-show=\"$ctrl.model.endDate\">&nbsp;&nbsp;&nbsp;To:&nbsp;</span><span ng-show=\"$ctrl.model.endDate\" class=\"education-end-date\">{{$ctrl.model.endDate | date: \'yyyy\'}}</span></div><div class=\"education-activities\">{{$ctrl.model.activities}}</div></div><form name=\"editForm\" ng-if=\"$ctrl.editing\" ng-submit=\"$ctrl.update(editForm)\" novalidate=\"novalidate\"><md-input-container class=\"md-block\"><label>School Name</label><input id=\"sup-j-education-schoolName\" ng-model=\"$ctrl.model.school\" name=\"school\" autofocus=\"autofocus\" required=\"required\" class=\"education-school\"/><div ng-messages=\"editForm.school.$error\"><p ng-message=\"required\">School name is required</p></div></md-input-container><md-input-container class=\"md-block\"><label>Field</label><input id=\"sup-j-education-field\" ng-model=\"$ctrl.model.field\" name=\"field\" required=\"required\" class=\"education-field\"/><div ng-messages=\"editForm.field.$error\"><p ng-message=\"required\">Your field is required</p></div></md-input-container><div layout=\"row\"><md-input-container class=\"flex\"><label>From</label><md-datepicker id=\"sup-j-education-startDate\" ng-model=\"$ctrl.model.startDate\" md-hide-icons=\"calendar\" ng-required=\"true\" name=\"startDate\" type=\"date\" md-max-date=\"$ctrl.currentDate\" md-open-on-focus=\"md-open-on-focus\" class=\"education-start-date\"></md-datepicker><div ng-messages=\"editForm.startDate.$error\"><p ng-message=\"required\">Start Date is required</p><p ng-message=\"valid\">Start Date must be a valid date</p><p ng-message=\"maxdate\">Start Date should be less than Today</p></div></md-input-container><md-input-container class=\"flex\"><label>To</label><md-datepicker id=\"sup-j-education-endDate\" ng-model=\"$ctrl.model.endDate\" md-hide-icons=\"calendar\" md-min-date=\"$ctrl.model.startDate\" type=\"date\" name=\"endDate\" md-open-on-focus=\"md-open-on-focus\" class=\"education-end-date\"></md-datepicker><div ng-messages=\"editForm.endDate.$error\"><p ng-message=\"valid\">End Date must be a valid date</p><p ng-message=\"mindate\">End Date should be greater than Start Date</p></div></md-input-container></div><md-input-container class=\"md-block\"><label>Degree</label><input id=\"sup-j-education-degree\" ng-model=\"$ctrl.model.degree\" name=\"degree\" required=\"required\" class=\"education-degree\"/><div ng-messages=\"editForm.degree.$error\"><p ng-message=\"required\">Degree is required</p></div></md-input-container><md-input-container class=\"md-block\"><label>Activities</label><textarea id=\"sup-j-education-activities\" ng-model=\"$ctrl.model.activities\" name=\"activities\" class=\"education-activities\"></textarea><div ng-messages=\"editForm.activities.$error\"><p ng-message=\"required\">Activities is required</p></div></md-input-container><md-button id=\"sup-j-education-save\" type=\"submit\" class=\"profile-button md-raised md-primary\">Save</md-button><md-button id=\"sup-j-education-cancel\" ng-mousedown=\"$ctrl.cancel(editForm)\" class=\"profile-button md-raised md-secondary\">Cancel</md-button></form>");
$templateCache.put("components/profile/educations/educations.html","<profile-timeline-tile title=\"Education\" icon=\"school\" on-help=\"$ctrl.help($event)\" on-add-item=\"$ctrl.addItem()\" show-add-button=\"{{!$ctrl.readOnly}}\" add-button-flex=\"true\" add-button-enabled=\"!$ctrl.isInEditMode()\" profile-tile-locker-id=\"$ctrl.profileTileLockerId\" limit-items-mobile=\"$ctrl.limitTo\" items-length=\"$ctrl.items.length\" max-items-mobile=\"$ctrl.limitMobile\" locked=\"$ctrl.locked\" read-only=\"$ctrl.readOnly\"><profile-timeline-item ng-repeat=\"education in $ctrl.items | limitTo: $ctrl.limitTo\" year=\"{{education.startDate | date:\'yyyy\'}}\" blocked=\"$ctrl.isBlocked(education)\" fixed-remove-icon=\"$ctrl.isEditing(education)\" on-remove=\"$ctrl.removeItem(education)\" read-only=\"$ctrl.readOnly\"><profile-education education=\"education\" editing=\"$ctrl.isEditing(education)\" on-edit=\"$ctrl.editItem(education)\" on-update=\"$ctrl.updateItem(education)\" on-cancel=\"$ctrl.cancelItem(education)\" read-only=\"$ctrl.readOnly\"></profile-education></profile-timeline-item></profile-timeline-tile>");
$templateCache.put("components/profile/hobbies/hobbies.html","<profile-tile title=\"Hobbies\" icon=\"favorite_border\" on-help=\"$ctrl.help()\" profile-tile-locker-id=\"$ctrl.profileTileLockerId\" locked=\"$ctrl.locked\" read-only=\"$ctrl.readOnly\"><div layout=\"row\" layout-wrap=\"layout-wrap\" class=\"hobbies-content\"><md-chips id=\"sup-j-profile-hobbies\" ng-model=\"$ctrl.user.hobbies\" md-transform-chip=\"$ctrl.newHobby($chip)\" readonly=\"$ctrl.readOnly\" md-on-add=\"$ctrl.save()\" md-on-remove=\"$ctrl.remove($chip)\" placeholder=\"Hobby name\" class=\"hobbies-text\"><md-chip-template><span>{{$chip.name}}</span></md-chip-template></md-chips></div></profile-tile>");
$templateCache.put("components/profile/languages/languages.html","<profile-tile title=\"Languages\" icon=\"language\" on-help=\"$ctrl.help()\" on-add-item=\"$ctrl.addItem()\" show-add-button=\"{{!$ctrl.readOnly}}\" add-button-flex=\"true\" profile-tile-locker-id=\"$ctrl.profileTileLockerId\" limit-items-mobile=\"$ctrl.limitTo\" items-length=\"$ctrl.user.languageSkills.length\" max-items-mobile=\"$ctrl.limitMobile\" disabled-show-more-button=\"$ctrl.disabledShowMoreButton\" add-button-enabled=\"!$ctrl.disabledShowMoreButton\" locked=\"$ctrl.locked\" read-only=\"$ctrl.readOnly\"><div ng-repeat=\"language in $ctrl.user.languageSkills | limitTo: $ctrl.limitTo\" class=\"language-content\"><md-input-container md-no-float=\"\" class=\"md-block\"><i id=\"sup-j-profile-languages-removeButton-{{ language.name.split(\' \').join(\'\') }}\" ng-hide=\"$ctrl.readOnly\" ng-click=\"$ctrl.removeItem(language)\" class=\"material-icons remove-icon\">clear</i><input ng-if=\"$ctrl.readOnly\" id=\"sup-j-profile-language-{{ language.name.split(\' \').join(\'\') }}\" type=\"text\" flex=\"grow\" ng-change=\"$ctrl.doUpdate(language); $ctrl.enableShowMoreButton()\" ng-model=\"language.name\" ng-model-options=\"{updateOn: \'blur\'}\" readonly=\"$ctrl.readOnly\" aria-label=\"Language name\" required=\"required\" placeholder=\"Language name\" name=\"languageName_{{$index}}\" class=\"single-line\"/><input ng-if=\"!$ctrl.readOnly\" id=\"sup-j-profile-language-{{ language.name.split(\' \').join(\'\') }}\" type=\"text\" flex=\"grow\" ng-change=\"$ctrl.doUpdate(language); $ctrl.enableShowMoreButton()\" ng-model=\"language.name\" ng-model-options=\"{updateOn: \'blur\'}\" aria-label=\"Language name\" required=\"required\" placeholder=\"Language name\" name=\"languageName_{{$index}}\" class=\"single-line\"/><div layout=\"row\" class=\"language-grade-container\"><div ng-repeat=\"level in [1,2,3,4,5]\" ng-click=\"$ctrl.setLevel(language, level)\" ng-show=\"language._id\" class=\"language-grade\"><span ng-class=\"$ctrl.getLevelClass(language, level)\" ng-mouseenter=\"$ctrl.setHover(language, level)\" ng-mouseleave=\"$ctrl.unsetHover(language)\" class=\"empty\"><i class=\"material-icons\">grade</i></span></div></div><div ng-messages=\"languageForm[\'languageName_\'+$index].$error\"><div ng-message=\"required\">Name cannot be empty</div></div></md-input-container></div></profile-tile>");
$templateCache.put("components/profile/qualificationSummary/qualificationSummary.html","<profile-tile title=\"Qualification Summary\" icon=\"assignment_turned_in\" on-help=\"$ctrl.help($event)\" profile-tile-locker-id=\"$ctrl.profileTileLockerId\" locked=\"$ctrl.locked\" read-only=\"$ctrl.readOnly\"><md-input-container class=\"md-block\"><textarea id=\"sup-j-profile-qualificationSummary\" ng-model=\"$ctrl.user.summaryOfQualification\" ng-if=\"$ctrl.readOnly\" readonly=\"$ctrl.readOnly\" ng-change=\"$ctrl.update()\" ng-model-options=\"{updateOn: \'default blur\', debounce:{ \'default\': 1500, \'blur\': 0}}\" aria-label=\"Qualification Summary\" class=\"qualification-summary\"></textarea><textarea id=\"sup-j-profile-qualificationSummary\" ng-model=\"$ctrl.user.summaryOfQualification\" ng-if=\"!$ctrl.readOnly\" ng-change=\"$ctrl.update()\" ng-model-options=\"{updateOn: \'default blur\', debounce:{ \'default\': 1500, \'blur\': 0}}\" aria-label=\"Qualification Summary\" class=\"qualification-summary\"></textarea></md-input-container></profile-tile>");
$templateCache.put("components/profile/skills/skills.html","<profile-tile title=\"Skills\" icon=\"desktop_windows\" on-help=\"$ctrl.help()\" on-add-item=\"$ctrl.displayAutocomplete()\" on-show-more=\"$ctrl.showMore()\" limit-items-mobile=\"$ctrl.limitTo\" items-length=\"$ctrl.user.skillsCloud.length\" max-items-mobile=\"$ctrl.limitMobile\" disabled-show-more-button=\"$ctrl.disabledShowMoreButton\" show-add-button=\"{{!$ctrl.readOnly}}\" add-button-flex=\"true\" id=\"skills-tile\" profile-tile-locker-id=\"$ctrl.profileTileLockerId\" add-button-enabled=\"!$ctrl.disabledShowMoreButton\" locked=\"$ctrl.locked\" read-only=\"$ctrl.readOnly\"><div flex-gt-sm=\"85\" flex=\"80\" layout=\"column\" class=\"skill-years-caption\"><div layout=\"row\" layout-align=\"space-between\"><div ng-repeat=\"year in [1, 3, 6, 9, 12, 15]\" class=\"skill-year\">{{year}}</div></div><div layout=\"row\" layout-align=\"space-between\"><div flex=\"\" ng-repeat=\"divider in [0, 1, 2, 3, 4]\" class=\"skill-year-divider\"></div></div></div><div layout=\"row\" layout-align=\"space-between none\" ng-show=\"$ctrl.showAutocomplete\" class=\"profile-list-item autocomplete\"><md-input-container md-no-float=\"\" flex=\"flex\"><md-autocomplete id=\"auto-complete-container\" ng-form=\"$ctrl.skillAutocompleteForm\" md-input-name=\"skillAutocomplete\" md-search-text=\"$ctrl.searchText\" md-items=\"item in $ctrl.querySearch($ctrl.searchText)\" md-item-text=\"item.name\" md-selected-item-change=\"$ctrl.addItem(item);\" placeholder=\"Skill name\" md-no-cache=\"true\" aria-label=\"Skill name\" md-autofocus=\"true\" md-require-match=\"true\"><md-item-template><span md-highlight-text=\"$ctrl.searchText\">{{ item.name }}</span></md-item-template></md-autocomplete><i id=\"sup-j-profile-skills-removeButton-new-skill\" ng-hide=\"$ctrl.readOnly\" ng-click=\"$ctrl.removeItem(skill)\" class=\"material-icons remove-icon\">clear</i><div ng-messages=\"$ctrl.skillAutocompleteForm.skillAutocomplete.$error\" ng-show=\"$ctrl.skillAutocompleteForm.skillAutocomplete.$touched\"><div ng-message=\"duplicate\">This skill already exists		</div></div></md-input-container></div><div layout=\"row\" layout-align=\"space-between none\" readonly=\"$ctrl.readOnly\" ng-repeat=\"skill in $ctrl.user.skillsCloud | limitTo: $ctrl.limitTo\" ng-form=\"skillForm\" class=\"profile-list-item mobile skill-container\"><div flex=\"grow\" layout=\"column\" class=\"skill-slider\"><md-input-container flex=\"flex\" md-no-float=\"\" ng-class=\"skill-repeat\"><input id=\"sup-j-profile-skillName-{{ skill.name.split(\' \').join(\'\') }}\" type=\"text\" ng-change=\"$ctrl.updateItem(skill)\" ng-model=\"skill.name\" name=\"skillName\" readonly=\"true\" ng-model-options=\"{updateOn: \'on blur\'}\" aria-label=\"Skill name\" skills-focus-on=\"$ctrl.focusItem()\" placeholder=\"Skill name\" required=\"required\"/></md-input-container><md-slider-container tabindex=\"-1\"><md-slider id=\"skill-slider\" min=\"{{$ctrl.min}}\" max=\"{{$ctrl.max}}\" md-discrete=\"\" ng-change=\"$ctrl.updateItem(skill)\" ng-model=\"skill.experienceYears\" ng-disabled=\"$ctrl.readOnly\" aria-label=\"skill-level\" name=\"experienceYears\" tabindex=\"-1\"></md-slider></md-slider-container><div class=\"md-errors-spacer\"></div><div class=\"error-messages\"><div ng-messages=\"skillForm.skillName.$error\" ng-if=\"skillForm.skillName.$touched\"><div ng-message=\"required\">Name cannot be empty</div></div><div ng-messages=\"skillForm.experienceYears.$error\" ng-if=\"skillForm.experienceYears.$touched\"><div ng-message=\"required\">Years cannot be empty</div><div ng-message=\"min\">Years cannot be less than 0</div></div></div></div><md-input-container flex-gt-sm=\"15\" flex=\"20\" class=\"skill-input\"><input id=\"sup-j-profile-skillNumber-{{ skill.name.split(\' \').join(\'\') }}\" type=\"number\" aria-controls=\"skill-slider\" min=\"{{$ctrl.min}}\" max=\"{{$ctrl.max}}\" ng-change=\"$ctrl.updateItem(skill)\" ng-model=\"skill.experienceYears\" readonly=\"$ctrl.readOnly\" ng-model-options=\"{updateOn: \'default blur\', debounce:{\'default\': 0, \'blur\': 0}}\" aria-label=\"skill-level\" required=\"required\" name=\"experienceYears\"/></md-input-container><i id=\"sup-j-profile-skills-removeButton-{{ skill.name.split(\' \').join(\'\') }}\" ng-hide=\"$ctrl.readOnly\" ng-click=\"$ctrl.removeItem(skill)\" class=\"material-icons remove-icon\">clear</i></div></profile-tile>");
$templateCache.put("components/profile/tile/profileTile.html","<div ng-show=\"$ctrl.locked\" class=\"profile-tile-locker\"></div><div layout=\"row\" layout-align=\"start center\" class=\"profile-tile-header\"><div class=\"profile-tile-icon\"><i class=\"material-icons\">{{$ctrl.icon}}</i></div><div class=\"profile-tile-title\">{{$ctrl.title}}</div><i ng-click=\"$ctrl.onHelp({$event: $event})\" ng-hide=\"$ctrl.readOnly\" class=\"material-icons profile-tile-help-icon\">help</i></div><div ng-transclude=\"ng-transclude\" class=\"profile-tile-content mobile\"></div><div layout=\"column\"><md-button id=\"sup-j-profile-showMoreButton-{{ $ctrl.title.split(\' \').join(\'\') }}\" ng-disabled=\"$ctrl.disabledShowMoreButton\" ng-class=\"{\'add-button-flex\': $ctrl.addButtonFlex==\'true\'}\" ng-click=\"$ctrl.onShowMore(); $ctrl.changeShowMoreButtonText()\" ng-show=\"$ctrl.showShowMoreButton()\" class=\"profile-show-more-button md-raised md-primary\">{{$ctrl.showMoreText}}</md-button><md-button id=\"sup-j-profile-addButton-{{ $ctrl.title.split(\' \').join(\'\') }}\" ng-disabled=\"!$ctrl.addButtonEnabled || $ctrl.locked\" ng-class=\"{\'add-button-flex\': $ctrl.addButtonFlex==\'true\'}\" ng-click=\"$ctrl.onAddItem()\" class=\"profile-add-button md-raised md-primary\">Add</md-button></div>");
$templateCache.put("components/profile/timelineItem/timelineItem.html","<div ng-class=\"{\'active\': $ctrl.blocked}\" class=\"timeline-item-blocker\"></div><div class=\"profile-list-item\"><i id=\"sup-j-profile-timeline-removeButton-{{ $ctrl.year }}\" ng-hide=\"$ctrl.readOnly\" ng-click=\"$ctrl.onRemove()\" ng-class=\"{\'fixed\': $ctrl.fixedRemoveIcon}\" class=\"material-icons remove-icon\">clear</i><div class=\"timeline-year\">{{$ctrl.year || \"&nbsp;\"}}</div><div ng-transclude=\"ng-transclude\" class=\"timeline-item-content\"></div></div>");
$templateCache.put("components/profile/timelineTile/timelineTile.html","<profile-tile title=\"{{$ctrl.title}}\" icon=\"{{$ctrl.icon}}\" on-help=\"$ctrl.onHelp({$event: $event})\" show-add-button=\"{{$ctrl.showAddButton}}\" add-button-flex=\"{{$ctrl.addButtonFlex}}\" add-button-enabled=\"$ctrl.addButtonEnabled &amp;&amp; !$ctrl.locked\" on-add-item=\"$ctrl.onAddItem()\" profile-tile-locker-id=\"$ctrl.profileTileLockerId\" limit-items-mobile=\"$ctrl.limitItemsMobile\" items-length=\"$ctrl.itemsLength\" max-items-mobile=\"$ctrl.maxItemsMobile\" locked=\"$ctrl.locked\" read-only=\"$ctrl.readOnly\"><div class=\"timeline-bar\"></div><div ng-transclude=\"ng-transclude\" ng-click=\"\" class=\"timeline-tile-content mobile\"></div></profile-tile>");
$templateCache.put("components/profile/topBar/topBar.html","<div id=\"sup-j-profile-topBar\" layout=\"row\" layout-xs=\"column\" layout-align-xs=\"center center\" flex-wrap=\"\"><img src=\"{{$ctrl.user.picture}}\"/><div layout=\"column\" layout-align-xs=\"center center\" class=\"details\"><div id=\"sup-j-profile-topBar-name\" class=\"name\">{{$ctrl.user.name | uppercase}}		</div><div id=\"sup-j-profile-topBar-position\" class=\"position\"><div><md-chips ng-model=\"$ctrl.userPositions\" md-transform-chip=\"$ctrl.transformChip($chip)\" readonly=\"$ctrl.readOnly\" md-on-add=\"$ctrl.addPosition()\" md-on-remove=\"$ctrl.removePosition($chip)\" md-max-chips=\"5\" md-require-match=\"true\"><md-autocomplete md-disabled=\"$ctrl.readOnly\" md-menu-class=\"position-autocomplete\" ng-hide=\"$ctrl.userPositions.length &gt; 5\" md-search-text=\"$ctrl.positionSearchText\" md-selected-item=\"$ctrl.positionSelectedItem\" md-items=\"item in $ctrl.getAvailablePositions($ctrl.positionSearchText)\" md-item-text=\"item\" placeholder=\"Add new role\"><span md-highlight-text=\"$ctrl.positionSearchText\" md-highlight-flags=\"i\">{{item}}</span></md-autocomplete><md-chip-template><span><strong>{{$chip.name}}		</strong></span></md-chip-template></md-chips></div></div></div><span flex=\"\"></span><div hide-xs=\"\" hide-sm=\"\" class=\"logo\"></div></div>");
$templateCache.put("components/profile/workingExperience/workingExperience.html","<div id=\"sup-j-profile-workingExperience-{{ $ctrl.model.position.split(\' \').join(\'\') }}\" ng-hide=\"$ctrl.editing\" ng-click=\"$ctrl.edit()\" class=\"details\"><h1><span class=\"experience-position\">{{$ctrl.model.position}}</span> at <span class=\"experience-company\">{{$ctrl.model.company}}</span></h1><div class=\"experience-client\"><span class=\"experience-client\">{{$ctrl.model.client}}</span></div><div class=\"experience-project\"><span class=\"experience-project\">{{$ctrl.model.project}}</span></div><div class=\"experience-dates\"><span>From:&nbsp;</span><span class=\"experience-start-date\">{{$ctrl.model.startDate | date: \'MM/yyyy\'}}</span><span ng-show=\"$ctrl.model.endDate\">&nbsp;&nbsp;&nbsp;To:&nbsp;</span><span ng-show=\"$ctrl.model.endDate\" class=\"experience-end-date\">{{$ctrl.model.endDate | date: \'MM/yyyy\'}}</span></div><div class=\"experience-description\">{{$ctrl.model.activityDescription}}</div></div><form name=\"editForm\" ng-if=\"$ctrl.editing\" ng-submit=\"$ctrl.update(editForm)\" novalidate=\"novalidate\"><md-input-container class=\"md-block\"><md-checkbox ng-model=\"$ctrl.model.isAvenueCode\" aria-label=\"Is Avenue Code\" ng-change=\"$ctrl.fillAvenueCodeCompany()\">Is Avenue Code</md-checkbox><md-checkbox ng-model=\"$ctrl.model.isCurrentPosition\" aria-label=\"Is Current Position\">Is Current Position</md-checkbox></md-input-container><md-input-container class=\"md-block\"><label>Company</label><input id=\"sup-j-workingExperience-company\" name=\"company\" ng-model=\"$ctrl.model.company\" ng-readonly=\"$ctrl.model.isAvenueCode\" autofocus=\"autofocus\" required=\"required\" class=\"experience-company\"/><div ng-messages=\"editForm.company.$error\"><div ng-message=\"required\">Company name cannot be empty</div></div></md-input-container><md-input-container ng-if=\"$ctrl.model.isAvenueCode\" class=\"md-block\"><label>Client</label><input name=\"client\" ng-model=\"$ctrl.model.client\" class=\"experience-client\"/></md-input-container><md-input-container ng-if=\"$ctrl.model.isAvenueCode\" class=\"md-block\"><label>Project</label><input name=\"project\" ng-model=\"$ctrl.model.project\" class=\"experience-project\"/></md-input-container><md-input-container class=\"md-block\"><label>Role</label><input id=\"sup-j-workingExperience-position\" name=\"position\" ng-model=\"$ctrl.model.position\" required=\"required\" class=\"experience-position\"/><div ng-messages=\"editForm.position.$error\"><div ng-message=\"required\">Role cannnot be empty</div></div></md-input-container><div layout=\"row\"><md-input-container flex=\"50\" class=\"flex\"><label>From</label><md-datepicker id=\"sup-j-workingExperience-startDate\" name=\"startDate\" ng-model=\"$ctrl.model.startDate\" md-hide-icons=\"calendar\" md-max-date=\"$ctrl.currentDate\" ng-required=\"true\" md-open-on-focus=\"md-open-on-focus\" class=\"experience-start-date\"></md-datepicker><div ng-messages=\"editForm.startDate.$error\"><div ng-message=\"required\">Start Date cannot be empty</div><div ng-message=\"valid\">Start Date must be a valid date</div><div ng-message=\"maxdate\">Start Date must be less than today</div></div></md-input-container><md-input-container ng-if=\"!$ctrl.model.isCurrentPosition\" flex=\"50\" class=\"flex\"><label>To</label><md-datepicker id=\"sup-j-workingExperience-endDate\" name=\"endDate\" ng-model=\"$ctrl.model.endDate\" md-hide-icons=\"calendar\" md-min-date=\"$ctrl.model.startDate\" md-open-on-focus=\"md-open-on-focus\" class=\"experience-end-date\"></md-datepicker><div ng-messages=\"editForm.endDate.$error\"><div ng-message=\"valid\">End Date must be a valid date</div><div ng-message=\"mindate\">End Date should be greater than Start Date</div></div></md-input-container></div><md-input-container class=\"md-block\"><label>Description</label><textarea id=\"sup-j-workingExperience-description\" name=\"description\" ng-model=\"$ctrl.model.activityDescription\" required=\"required\" class=\"experience-description\"></textarea><div ng-messages=\"editForm.description.$error\"><div ng-message=\"required\">Description cannot be empty</div></div></md-input-container><md-button id=\"sup-j-workingExperience-save\" type=\"submit\" class=\"profile-button md-raised md-primary\">Save</md-button><md-button id=\"sup-j-workingExperience-cancel\" ng-mousedown=\"$ctrl.cancel(editForm)\" class=\"profile-button md-raised md-secondary\">Cancel</md-button></form>");
$templateCache.put("components/profile/workingExperiences/workingExperiences.html","<profile-timeline-tile title=\"Working Experiences\" icon=\"card_travel\" on-help=\"$ctrl.help($event)\" on-add-item=\"$ctrl.addItem()\" show-add-button=\"{{!$ctrl.readOnly}}\" add-button-flex=\"true\" add-button-enabled=\"!$ctrl.isInEditMode()\" profile-tile-locker-id=\"$ctrl.profileTileLockerId\" limit-items-mobile=\"$ctrl.limitTo\" items-length=\"$ctrl.items.length\" max-items-mobile=\"$ctrl.limitMobile\" locked=\"$ctrl.locked\" read-only=\"$ctrl.readOnly\"><profile-timeline-item ng-repeat=\"experience in $ctrl.items | limitTo: $ctrl.limitTo\" year=\"{{experience.startDate | date:\'yyyy\'}}\" blocked=\"$ctrl.isBlocked(experience)\" fixed-remove-icon=\"$ctrl.isEditing(experience)\" on-remove=\"$ctrl.removeItem(experience)\" read-only=\"$ctrl.readOnly\"><profile-working-experience experience=\"experience\" editing=\"$ctrl.isEditing(experience)\" on-edit=\"$ctrl.editItem(experience)\" on-update=\"$ctrl.updateItem(experience)\" on-cancel=\"$ctrl.cancelItem(experience)\" read-only=\"$ctrl.readOnly\"></profile-working-experience></profile-timeline-item></profile-timeline-tile>");}]);