'use strict';

angular.module('roomApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'ngAnimate',
  'ngFx'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/main');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth, socket, usernameVal, $timeout) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {

      // tapping into state change to alert rooms that someone has left
      if(next.url === '/') {
        socket.socket.emit('onMainPage');
      } else {
        if (usernameVal.name==='') {
          $timeout(function() {$location.path('/main');}, 0);
        }
      }

      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/main');
        }
      });
    });
  });