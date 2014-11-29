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
      enter: function(roomNumber, color, geoRoom) {
        $http.get("/api/room/" + roomNumber + "/" + geoRoom)
          .success(function(data){

            $state.go("room", {roomNumber: roomNumber,
                               color: color,
                               geoRoom: geoRoom
                              });
         }).error(function(data){
            return "error";
         });
      },
      create: function(loc, color, geoRoom) {
        $http.post("/api/room", {lat: loc.lat, 
                               lon: loc.lon, 
                               color: color})
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
