'use strict';

angular.module('roomApp')
  .directive('roomBanner', function () {
    return {
      templateUrl: 'app/roomBanner/roomBanner.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });