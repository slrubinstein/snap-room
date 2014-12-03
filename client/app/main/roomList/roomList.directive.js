'use strict';

angular.module('roomApp')
  .directive('roomList', function () {
    return {
      templateUrl: 'app/main/roomList/roomList.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });