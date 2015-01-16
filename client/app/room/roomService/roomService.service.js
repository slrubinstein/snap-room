'use strict';

angular.module('roomApp')
  .factory('roomService', function ($http, $q, $location) {
 
  return {
    get: function (roomId) {
      return $http.get("/api/room/" + roomId)
    },

    setBackgroundColor: function(roomColor) {
      if (roomColor === "red") {
        $("body").css("background-color", "#D46A6A" );
      }
      else if (roomColor === "green") {
        $("body").css("background-color","#87FC81" );
      }
      else if (roomColor === "blue") {
        $("body").css("background-color", "#8DADF9" );
      }
    }
  }
});
