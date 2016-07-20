'use strict';

angular.module('superstarsApp', ['superstarsApp.auth', 'superstarsApp.constants', 'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io', 'ui.router', 'validation.match', 'ngMaterial', 'ngMessages', 'pascalprecht.translate', 'zInfiniteScroll']).config(function ($urlRouterProvider, $locationProvider, $translateProvider, $mdThemingProvider, appConfig) {
  $urlRouterProvider.otherwise('/');

  $locationProvider.html5Mode(true);

  $translateProvider.translations('en', appConfig.I18N.en);
  $translateProvider.preferredLanguage('en');

  $mdThemingProvider.theme('default').primaryPalette('blue').warnPalette('orange');
});
//# sourceMappingURL=../app/app.js.map
'use strict';

angular.module('superstarsApp.auth', ['superstarsApp.constants', 'superstarsApp.util', 'ngCookies', 'ui.router']).config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});
//# sourceMappingURL=../../components/auth/auth.module.js.map
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

var LoginController = function LoginController(Auth, $state) {
  _classCallCheck(this, LoginController);

  if (Auth.isLoggedIn()) {
    $state.go('main');
  }
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
			"error-login": "error-message-invalid-account"
		}
	});
})(angular);
//# sourceMappingURL=../app/app.constant.js.map
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var MainController = function MainController() {
    _classCallCheck(this, MainController);
  };

  angular.module('superstarsApp').component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });
})();
//# sourceMappingURL=../../app/main/main.controller.js.map
'use strict';

angular.module('superstarsApp').config(function ($stateProvider) {
  $stateProvider.state('main', {
    url: '/',
    template: '<main></main>',
    authenticate: true
  });
});
//# sourceMappingURL=../../app/main/main.js.map
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var ProfileController = function () {
    function ProfileController(User) {
      _classCallCheck(this, ProfileController);

      this.UserService = User;
    }

    _createClass(ProfileController, [{
      key: '$onInit',
      value: function $onInit() {
        var resource = this.UserService.getProfile({ username: 'helias' });
        resource.$promise.then(this.loadData.bind(this));
      }
    }, {
      key: 'loadData',
      value: function loadData(data) {
        this.user = data;
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
    template: '<profile></profile>'
  }).state('myprofile', {
    url: '/profile/me',
    template: '<profile></profile>',
    authenticate: true
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
        currentUser = {};
      },


      /**
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


      /**
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


      /**
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


      /**
       * Check if a user has a specified role or higher
       *   (synchronous|asynchronous)
       *
       * @param  {String}     role     - the role to check against
       * @param  {Function|*} callback - optional, function(has)
       * @return {Bool|Promise}
       */
      hasRole: function hasRole(role, callback) {
        var hasRole = function hasRole(r, h) {
          return userRoles.indexOf(r) >= userRoles.indexOf(h);
        };

        if (arguments.length < 2) {
          return hasRole(currentUser.role, role);
        }

        return Auth.getCurrentUser(null).then(function (user) {
          var has = user.hasOwnProperty('role') ? hasRole(user.role, role) : false;
          safeCb(callback)(has);
          return has;
        });
      },


      /**
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
          config.headers.Authorization = 'Bearer ' + $cookies.get('token');
        }
        return config;
      },


      // Intercept 401s and redirect you to login
      responseError: function responseError(response) {
        if (response.status === 401) {
          (state || (state = $injector.get('$state'))).go('login');
          // remove any stale tokens
          $cookies.remove('token');
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

(function () {

  function UserResource($resource) {
    var resource = $resource('/api/users/:username', {
      username: 'username'
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
        isArray: true
      },
      updateProfile: {
        method: 'PUT'
      }
    });

    return resource;
  }

  angular.module('superstarsApp.auth').factory('User', UserResource);
})();
//# sourceMappingURL=../../components/auth/user.service.js.map
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

  function NavbarController(Auth, $mdSidenav) {
    _classCallCheck(this, NavbarController);

    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.$mdSidenav = $mdSidenav;
    this.currentUser = Auth.getCurrentUser();
    this.ACDCLink = 'https://acdc.avenuecode.com';
    this.MilesLink = 'http://acmiles.avenuecode.com';
    this.AcademyLink = 'http://academy.avenuecode.com';
    this.SuperstarsLink = '/';
  }

  _createClass(NavbarController, [{
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

angular.module('superstarsApp').controller('OauthButtonsCtrl', function ($scope, $window, $translate, $cookies, appConfig, Auth) {
  var cookieName = 'error-login';
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

angular.module('superstarsApp').directive('toolbar', function (Auth, $mdSidenav) {
  var auth = Auth,
      mdSidenav = $mdSidenav;
  return {
    templateUrl: 'components/toolbar/toolbar.html',
    restrict: 'E',
    link: function link(scope) {
      scope.showSearch = false;
      scope.isLoggedIn = auth.isLoggedIn;
      scope.mdSidenav = mdSidenav;
      scope.toggleSearch = function () {
        scope.showSearch = !scope.showSearch;
      };

      scope.toggleSidenav = function (menuId) {
        scope.mdSidenav(menuId).toggle();
      };
    }
  };
});
//# sourceMappingURL=../../components/toolbar/toolbar.directive.js.map
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
      }
    }, {
      key: 'click',
      value: function click() {
        this.$state.go('profile', { username: this.user.username });
      }
    }]);

    return UserCardController;
  }();

  angular.module('superstarsApp').component('userCard', {
    templateUrl: 'components/userCard/userCard.html',
    controller: UserCardController,
    bindings: {
      user: '<',
      onClick: '&'
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
    function UserListController(User) {
      _classCallCheck(this, UserListController);

      this.UserService = User;
      this.users = [];
      this.usersShown = [];
      this.usersToShow = 16;
      this.eventHandler = loadMoreEventHandler.bind(this);
    }

    _createClass(UserListController, [{
      key: '$onInit',
      value: function $onInit() {
        var resource = this.UserService.getAllUsers();
        resource.$promise.then(this.loadUser.bind(this));
      }
    }, {
      key: 'loadUser',
      value: function loadUser(data) {
        this.users = data;
        this.usersShown = this.users.slice(0, this.usersToShow);
      }
    }, {
      key: 'click',
      value: function click(user) {
        this.onClick({ user: user });
      }
    }]);

    return UserListController;
  }();

  angular.module('superstarsApp').component('userList', {
    templateUrl: 'components/userList/userList.html',
    controller: UserListController,
    bindings: {
      onClick: '&'
    }
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
angular.module("superstarsApp").run(["$templateCache", function($templateCache) {$templateCache.put("components/footer/footer.html","<div class=\"container\"><p>Angular Fullstack v3.7.5 | <a href=\"https://twitter.com/tyhenkel\">@tyhenkel</a> | <a href=\"https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open\">Issues</a></p></div>");
$templateCache.put("components/navbar/navbar.html","<md-sidenav md-component-id=\"left\" md-is-locked-open=\"$mdMedia(\'gt-md\')\" class=\"md-sidenav-left md-whiteframe-z2\"><md-toolbar><div layout=\"column\" layout-align=\"center center\" ng-show=\"nav.isLoggedIn()\" class=\"inset\"> <img src=\"{{ nav.currentUser.picture }}\" alt=\"{{nav.currentUser.picture}}\" class=\"avatar-picture\"/><div>{{ nav.currentUser.name | uppercase}}</div><div class=\"user-position\">{{nav.currentUser.currentPosition || \'[Position]\' | uppercase}}</div></div><div layout=\"column\" layout-align=\"center center\" ng-hide=\"nav.isLoggedIn()\" class=\"inset unsigned-user-toolbar\"> <i class=\"material-icons\">account_circle</i><oauth-buttons></oauth-buttons></div></md-toolbar><md-divider>  </md-divider><md-content><md-list class=\"md-dense\"><md-list-item class=\"md-2-line active-link\"><a href=\"{{nav.SuperstarsLink}}\"><i class=\"material-icons\">star</i>SUPERSTARS</a></md-list-item><md-list-item class=\"md-2-line\"><a href=\"{{nav.ACDCLink}}\" target=\"_blank\"><i class=\"material-icons\">date_range</i>ACDC</a></md-list-item><md-list-item class=\"md-2-line\"><a href=\"{{nav.AcademyLink}}\" target=\"_blank\"><i class=\"material-icons\">school</i>ACADEMY</a></md-list-item><md-list-item class=\"md-2-line\"><a href=\"{{nav.MilesLink}}\" target=\"_blank\"><i class=\"material-icons\">account_balance_wallet</i>MILES</a></md-list-item></md-list></md-content><div ng-show=\"nav.isLoggedIn()\"> <md-divider class=\"bottom-divider\"></md-divider><md-content class=\"bottom-content\"><div class=\"logout-container\"><md-button ng-href=\"/logout\" class=\"md-raised\">Logout</md-button></div></md-content></div></md-sidenav>");
$templateCache.put("components/oauth-buttons/oauth-buttons.html","<md-button ng-click=\"OauthButtons.loginOauth(&quot;google&quot;)\" class=\"md-raised md-primary\">Login</md-button>");
$templateCache.put("components/toolbar/toolbar.html","<md-toolbar id=\"superstars-header\" ng-show=\"isLoggedIn()\" class=\"animate-show md-whiteframe-z1\"><div class=\"md-toolbar-tools\"><md-button ng-click=\"toggleSidenav(\'left\')\" hide-gt-md=\"\" aria-label=\"Menu\" class=\"md-icon-button\"><i class=\"material-icons\">menu</i></md-button><i class=\"material-icons\">search    </i><span flex=\"\"><md-autocomplete md-theme=\"input\" md-input-name=\"autocompleteField\" md-selected-item=\"selectedItem\" md-search-text=\"searchText\" md-items=\"item\" md-item-text=\"item.display\" placeholder=\"Search for people, skills, positions, clients, projects and more\" class=\"autocomplete-toolbar\"><md-item-template><span md-highlight-text=\"searchText\">{{item.display}}</span></md-item-template></md-autocomplete></span><div class=\"button-container\"><md-button aria-label=\"{{ &quot;profile&quot; | translate }}\"><a ui-sref=\"myprofile\" ui-sref-active=\"active\"><i class=\"material-icons\">account_circle</i><span class=\"text-icon\">{{ \"profile\" | translate }}      </span></a></md-button><md-button aria-label=\"{{ &quot;help&quot; | translate }}\">     <a ui-sref=\"help\" ui-sref-active=\"active\"><i class=\"material-icons\">help</i><span class=\"text-icon\">{{ \"help\" | translate }}</span></a></md-button></div></div></md-toolbar>");
$templateCache.put("components/userCard/userCard.html","<div ng-click=\"$ctrl.click()\" layout=\"column\" layout-align=\"none center\" class=\"container\"><img ng-src=\"{{$ctrl.user.picture}}\" alt=\"\" class=\"user-avatar\"/><div class=\"user-name\">{{$ctrl.user.name}}</div><div class=\"user-position\">{{$ctrl.user.currentPosition || \'[Position]\'}}</div><div class=\"user-city\"><i class=\"marker-icon material-icons\">room</i>{{$ctrl.user.city || \'[City]\'}}</div><div class=\"user-email\"><md-tooltip md-direction=\"bottom\">{{$ctrl.user.email}}</md-tooltip><div class=\"user-email-text\">{{$ctrl.user.email}}</div></div><div layout=\"row\" layout-align=\"center center\" class=\"actions\"><div ng-show=\"$ctrl.user.social.facebook\" class=\"action facebook\"><md-tooltip md-direction=\"bottom\">{{$ctrl.user.social.facebook}}</md-tooltip><a ng-href=\"{{$ctrl.socialUrls.facebook}}\" target=\"_blank\"><i class=\"fa fa-facebook-square\"></i></a></div><div ng-show=\"$ctrl.user.social.twitter\" class=\"action twitter\"><md-tooltip md-direction=\"bottom\">{{$ctrl.user.social.twitter}}</md-tooltip><a ng-href=\"{{$ctrl.socialUrls.twitter}}\" target=\"_blank\"><i aria-hidden=\"true\" class=\"fa fa-twitter\"></i></a></div><div ng-show=\"$ctrl.user.social.skype\" class=\"action skype\"><md-tooltip md-direction=\"bottom\">{{$ctrl.user.social.skype}}</md-tooltip><i aria-hidden=\"true\" class=\"fa fa-skype\"></i></div><div ng-show=\"$ctrl.user.social.linkedIn\" class=\"action linkedIn\"><md-tooltip md-direction=\"bottom\">{{$ctrl.user.social.linkedIn}}</md-tooltip><a ng-href=\"{{$ctrl.socialUrls.linkedIn}}\" target=\"_blank\"><i aria-hidden=\"true\" class=\"fa fa-linkedin\"></i></a></div></div></div>");
$templateCache.put("components/userList/userList.html","<div layout=\"row\" layout-wrap=\"layout-wrap\" flex=\"flex\" z-infinite-scroll=\"$ctrl.eventHandler\" body-scroll=\"true\"><user-card ng-repeat=\"user in $ctrl.usersShown\" flex-xs=\"100\" flex-sm=\"50\" flex=\"25\" user=\"user\" on-click=\"$ctrl.click(user)\"></user-card></div>");
$templateCache.put("app/main/main.html","<user-list></user-list>");
$templateCache.put("app/profile/profile.html","<br/><br/><br/>User Data - \n{{ $ctrl.user}}");
$templateCache.put("app/account/login/login.html","<div layout=\"row\" layout-align=\"center center\" layout-fill=\"layout-fill\" class=\"login-container\"><md-content class=\"oauth-button-container\"><div layout=\"column\" layout-sm=\"column\" layout-align=\"center center\" layout-wrap=\"\"><img alt=\"Avenue Code Superstars\" src=\"assets/images/main_logo-c45f76e722.png\" class=\"img-responsive text-center\"/><p>You need to have an Avenue Code account to access this application.</p><p class=\"error\">{{ serverMessage }}</p><br/><br/><oauth-buttons classes=\"btn-block\"></oauth-buttons></div></md-content></div>");}]);