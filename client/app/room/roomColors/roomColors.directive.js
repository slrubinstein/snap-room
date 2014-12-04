'use strict';

angular.module('roomApp')
  .directive('roomColors', function () {
    return {
      template: '<div></div>',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        element.text('this is the roomColors directive');
      }
    };
  });