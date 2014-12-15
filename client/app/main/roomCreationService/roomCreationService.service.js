'use strict';

angular.module('roomApp')
  .factory('roomCreationService', function ($q, $http, $state, socket) {

    return {

      get: function (latLong) {
        var deferred = $q.defer();

        $http.get("/api/room/latlon/" + latLong)  
         .success(function(rooms){
            deferred.resolve(rooms);
          })
         .error(function(error){
            deferred.reject();
          });
         return deferred.promise;
      },
      
      enter: function(options) {

        var roomId = options.roomId,
            color = options.color,
            isLoggedIn = options.isLoggedIn,
            roomType = options.type;

        var stateGo = function() {
          $state.go("room." + roomType, {roomId: roomId,
                                color: color
                              });
        }
        stateGo();
      },

      create: function(options) {

        var color = options.color,
            geoRoomArr = options.geoRoomArr,
            geoRoom = options.geoRoomArr[0],
            type = options.type;

        var stateGo = function(roomId) {
          $state.go("room." + type, {roomId: roomId,
                                      color: color,
                                      geoRoom: geoRoom,
                                    });
          socket.socket.emit('createRoom', roomId, geoRoomArr)
        }

        $http.post("/api/room", options)
        .success(function(data) {
          var roomId = data._id;
          $http.post("/api/" + type + "Room", {roomId : roomId})
          .success(function() {   
            stateGo(roomId);
            //timerFactory.timerListener();
             })
          .error(function(error){

          })
 
        }) 
        .error(function(data){
          console.log("error creating room");
        });  
      }
    }
  });
