'use strict';

angular.module('roomApp')
  .factory('roomCreationService', function ($q, $http, $state, socket) {

    return {
      get: function (loc) {
        var deferred = $q.defer();

        $http.get("/api/room/" + loc.lat.toFixed(1) + "/" + loc.lon.toFixed(1))
         .success(function(rooms){
            deferred.resolve(rooms);
          })
         .error(function(error){
            deferred.reject();
          });
         return deferred.promise;
      },
      enter: function(options) {

        var lat = options.geoData.lat,
            lon = options.geoData.lon,
            roomNumber = options.roomNumber,
            color = options.color,
            geoRoom = options.geoRoom,
            isLoggedIn = options.isLoggedIn;

        var stateGo = function() {
          $state.go("room", {roomNumber: roomNumber,
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

        var lat = options.lat,
            lon = options.lon,
            color = options.color,
            lock = options.lock || null,
            geoRoom = options.geoRoom,
            type = options.type,
            roomName = options.roomName,
            timerLength = options.timerLength;

        $http.post("/api/room", {lat: lat, 
                                 lon: lon, 
                                 color: color,
                                 lock: lock,
                                 geoRoom: geoRoom,
                                 type: type,
                                 roomName: roomName,
                                 timerLength: timerLength})
        .success(function(data){
          $state.go("room", {roomNumber: data.roomNumber,
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
