'use strict';

angular.module('roomApp')
  .directive('fourSquare', function () {
    return {
      templateUrl: 'app/room/fourSquare/fourSquare.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });