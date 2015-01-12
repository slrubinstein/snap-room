'use strict';

angular.module('roomApp')
  .directive('foursquarerestButton', function () {
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {
      	element.on("click", function() {
          $(element).parent().addClass('animated fadeOutUp');
          scope.$apply(attrs.voteFunction);
      	});
      }
    };
  });