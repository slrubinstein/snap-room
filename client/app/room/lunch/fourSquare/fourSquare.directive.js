'use strict';

angular.module('roomApp')
  .directive('fourSquare', function () {
    return {
      templateUrl: 'app/room/lunch/fourSquare/fourSquare.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });