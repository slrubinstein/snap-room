'use strict';

angular.module('roomApp')
  .filter('timeFormat', function () {
    return function (input) {
    	var min, sec;

    	min = String(input/60).substring(0, 1);

    	sec = input%60;

    	if (sec < 10) {
    		sec = '0' + sec;
    	}

      return min + ':' + sec;
    };
  });
