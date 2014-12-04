'use strict';

angular.module('roomApp')
	// .controller('testController', function() {});this
  .directive('roomWall', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
      	// console.log('scope', scope)
      	// var windowHeight = $(window).innerHeight();

      	// console.log('window height', windowHeight)

      	// element.css('min-height', windowHeight)
      	if (scope.room) {
	      	var roomColor = scope.room.params.color;
	      	switch(roomColor) {
	      		case 'red':
	      			element.addClass('redWall');
	      			break;
	      		case 'blue':
	      			element.addClass('blueWall');
	      			break;
	      		case 'green':
	      			element.addClass('greenWall');
	      			break;
	      	}
	      }
      }
    };
  })
  .directive('roomTrim', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
      	var roomColor = scope.room.params.color;
      	switch(roomColor) {
      		case 'red':
      			element.addClass('redTrim');
      			break;
      		case 'blue':
      			element.addClass('blueTrim');
      			break;
      		case 'green':
      			element.addClass('greenTrim');
      			break;
      	}
      }
    };
  })
  .directive('roomAccent', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
      	var roomColor = scope.room.params.color;
      	switch(roomColor) {
      		case 'red':
      			element.addClass('redAccent');
      			break;
      		case 'blue':
      			element.addClass('blueAccent');
      			break;
      		case 'green':
      			element.addClass('greenAccent');
      			break;
      	}
      }
    };
  })
  .directive('roomTrimFont', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
      	var roomColor = scope.room.params.color;
      	switch(roomColor) {
      		case 'red':
      			element.addClass('redTrimFont');
      			break;
      		case 'blue':
      			element.addClass('blueTrimFont');
      			break;
      		case 'green':
      			element.addClass('greenTrimFont');
      			break;
      	}
      }
    };
  });