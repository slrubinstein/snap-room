'use strict';

angular.module('roomApp')
  .directive('restaurantList', function () {
    return {
      templateUrl: 'app/room/restaurantList/restaurantList.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });