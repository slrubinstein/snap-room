'use strict';

angular.module('roomApp')
  .directive('foursquareButton', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
      	 element.on("click", function() {

      	  if (attrs.buttontype === "show" || 
      	      attrs.buttontype === "hide") {
          	
          	$(element).toggleClass('ng-hide');
          	$('.foursquareRests').toggleClass('ng-hide')
          	.toggleClass("addMargin30");

          	if (attrs.buttontype === "show") {
	          $(element).prev().toggleClass('ng-hide');
	         }
	        else { //buttontype is "hide"
	          $(element).next().toggleClass('ng-hide');
	         }
      	  
      	  }	

	      else { //buttontype is "load"
	      	scope.$apply(attrs.whenClicked);
	      }

      	});

      }
    };
  });