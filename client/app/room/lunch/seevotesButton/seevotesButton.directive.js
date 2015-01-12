'use strict';

angular.module('roomApp')
  .directive('seevotesButton', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
        element.on("click",function() {
          $(element).closest('.list-group-item').next().toggleClass('ng-hide');
        });
      }
    };
  });