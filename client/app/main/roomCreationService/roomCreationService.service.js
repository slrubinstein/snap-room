'use strict';

angular.module('roomApp')
  .factory('roomCreationService', function ($q, $http, $state, socket) {

    return {

      get: function (latLong) {
        return $http.get("/api/room/latlon/" + latLong)  
      },
      
      enter: function(options) {

        var roomId = options.roomId,
            color = options.color,
            roomType = options.type;

        var stateGo = function() {
          $state.go("room." + roomType, {roomId: roomId,
                                color: color
                              });
        }
        stateGo();
      },

      createGeneral: function(options) {

        return $http.post("/api/room", options)
 
      },

      createSpecific: function(type, roomId) {

        return $http.post("/api/" + type + "Room", 
                              {roomId : roomId })
 
      }
    }
  });
