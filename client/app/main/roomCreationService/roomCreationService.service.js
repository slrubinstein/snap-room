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
            isLoggedIn = options.isLoggedIn,
            roomType = options.type;

        var stateGo = function() {
          $state.go("room." + roomType, {roomNumber: roomNumber,
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

        var stateGo = function(roomNumber) {
          $state.go("room." + type, {roomNumber: roomNumber,
                                      color: color,
                                      geoRoom: geoRoom,
                                    });
              socket.socket.emit('createRoom', roomNumber, geoRoomArr)
        }

        $http.post("/api/room", options)
        .success(function(data) {
          var roomNumber = data.roomNumber;
          if (type !== 'splitcheck') {
            $http.post("/api/" + type + "Room", {"roomNumber" : roomNumber})
            .success(function() {   
              stateGo(roomNumber);
              //timerFactory.timerListener();
               })
            .error(function(error){
              console.log('error creating room')
            })
          }
          else {
            stateGo(roomNumber);
         }
        }) 
        .error(function(data){
          console.log("error creating room");
        });  
      }
    }
  });
