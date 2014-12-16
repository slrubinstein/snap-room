'use strict';

angular.module('roomApp')
  .factory('mainService', function () {
    return {
       changeBackgroundColor: function(color) {
       	  $("body").css("background-color", color);
       }
    }
  });
