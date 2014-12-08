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

        var roomNumber = options.roomNumber,
            color = options.color,
            geoRoom = options.geoRoom,
            isLoggedIn = options.isLoggedIn,
            roomType = options.type;

        var stateGo = function() {
          $state.go("room." + roomType, {roomNumber: roomNumber,
                                color: color,
                                geoRoom: geoRoom
                              });
        }

        $http.get("/api/room/" + roomNumber)
          .success(function(room){
            if(room.lock === null) {
              stateGo();
            }
            else if(room.lock !== null && isLoggedIn) {
              stateGo();
            }
            else {
              console.log('You must log in to enter this room.')
            }
          }).error(function(room){
            return "error";
          });
      },
      create: function(options) {

        var color = options.color,
            geoRoom = options.geoRoomArr[0],
            type = options.type;

        $http.post("/api/room", options)
        .success(function(data){
          $state.go("room." + type, {roomNumber: data.roomNumber,
                                color: color,
                                geoRoom: geoRoom
                              });
          socket.socket.emit('createRoom', data.roomNumber, color, geoRoom)
          //timerFactory.timerListener();
        })
        .error(function(data){
          console.log("error creating room");
        });  
      }
    }
  });
