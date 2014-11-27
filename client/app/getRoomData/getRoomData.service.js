'use strict';

angular.module('roomApp')
  .factory('getRoomData', function ($http) {
    return {
      get: function (roomNumber) {
        var roomData = {};
        $http.get("/api/room/" + roomNumber)
         .success(function(data){
          roomData.initialRoomData = data;
          roomData.roomColor = data.color;
          roomData.expiresAt = new Date(Date.parse(data.expiresAt));
          // roomData.countDown = $interval(ctrl.runTimer, 1000); 
          
          console.log('room data', roomData)
          return roomData;
       }).error(function(data){
          return "error";
       });
      }
    };
  });
