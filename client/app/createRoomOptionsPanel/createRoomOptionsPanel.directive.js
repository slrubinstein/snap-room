'use strict';

angular.module('roomApp')
  .directive('createRoomOptionsPanel', function () {
    return {
      templateUrl: 'app/createRoomOptionsPanel/createRoomOptionsPanel.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });