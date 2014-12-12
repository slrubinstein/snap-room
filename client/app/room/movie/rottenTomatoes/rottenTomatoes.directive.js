'use strict';

angular.module('roomApp')
  .directive('rottenTomatoes', function () {
    return {
      templateUrl: 'app/room/movie/rottenTomatoes/rottenTomatoes.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });