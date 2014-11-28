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
      enter: function(roomNumber) {
        $http.get("/api/room/" + roomNumber)
          .success(function(data){

            $state.go("room", {'roomNumber': roomNumber});
         }).error(function(data){
            return "error";
         });
      },
      create: function(loc, color) {
        $http.post("/api/room", {lat: loc.lat, 
                               lon: loc.lon, 
                               color: color})
        .success(function(data){
          $state.go("room", {roomNumber: data.roomNumber,
                              color: color});
          socket.socket.emit('createRoom', data.roomNumber, color)
          //timerFactory.timerListener();
        })
        .error(function(data){
          console.log("error creating room");
        });  
      }
    }
  });
