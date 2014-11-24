'use strict';

/**
 * @ngdoc service
 * @name roomApp.timerFactory
 * @description
 * # timerFactory
 * Factory in the roomApp.
 */
angular.module('roomApp')
  .factory('timerFactory', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
