'use strict';

angular.module('roomApp')
  .directive('createRoomPanel', function () {
    return {
      templateUrl: 'app/main/createRoomPanel/createRoomPanel.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });