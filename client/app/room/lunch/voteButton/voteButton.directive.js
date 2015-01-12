'use strict';

angular.module('roomApp')
  .directive('voteButton', function () {
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {
        element.on("click", function() {
		  scope.$apply(attrs.vote); 
		  var colorClass;

	      switch(scope.room.roomColor) {
	        case 'red':
              colorClass = 'redTrim';
              break;
            case 'blue':
              colorClass = 'blueTrim';
              break;
            case 'green':
              colorClass = 'greenTrim';
              break;
	      }

        $(element).closest('.list-group-item').addClass(colorClass);
        setTimeout(function() {
          $(element).closest('.list-group-item').removeClass(colorClass);
        }, 100);
        });
      }
    };
  });