'use strict';

angular.module('roomApp')
  .factory('populateRooms', function ($q, $http, $state, socket) {

    return {
      get: function (loc) {
        var deferred = $q.defer();

        $http.get("/api/room/" + loc.lat.toFixed(1) + "/" + loc.lon.toFixed(1))
         .success(function(rooms){
            deferred.resolve(rooms);
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

        var go = $state.go("room", {roomNumber: roomNumber,
                                 color: color,
                                 geoRoom: geoRoom
                                });

        $http.get("/api/room/" + lat.toFixed(1) + "/" + lon.toFixed(1))
          .success(function(room){
            console.log('room', room)
            console.log('logged', isLoggedIn)
            console.log('locked', room.lock)
            if(room.lock === null) {
              go();
            }
            else if(room.lock !== null && isLoggedIn) {
              go();
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
            geoRoom = options.geoRoom

        $http.post("/api/room", {lat: lat, 
                                 lon: lon, 
                                 color: color,
                                 lock: lock,
                                 geoRoom: geoRoom})
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
