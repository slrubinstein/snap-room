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
        // $http.get("/api/room" + roomNumber)
        // .success(function(data) {
        //   var roomNumber = data.roomNumber;
        //   if (type !== 'backgammon' && type !== 'splitcheck') {
        //     $http.post("/api/" + type + "Room", {"roomNumber" : data.roomNumber})
        //     .success(function(data) {   
        //       console.log(data);
        //       ctrl.roomType = type;  
        //       $state.go("room." + type, {roomNumber: data.roomNumber,
        //                           color: color,
        //                           geoRoom: geoRoom,
        //                           type: type
        //                         });
        //       socket.socket.emit('createRoom', data.roomNumber, geoRoomArr)
        //       //timerFactory.timerListener();
        //        })
        //     .error(function(error){

        //     })
        //   }
        //   else {
        //     $state.go("room." + type, {roomNumber: data.roomNumber,
        //               color: color,
        //               geoRoom: geoRoom
        //     });
        //  }
        // }) 
        // .error(function(data){
        //   console.log("error creating room");
        // });  
      },

      roomType: "",

      create: function(options) {
        var ctrl = this;
        var color = options.color,
            geoRoomArr = options.geoRoomArr,
            geoRoom = options.geoRoomArr[0],
            type = options.type;

        $http.post("/api/room", options)
        .success(function(data) {
          var roomNumber = data.roomNumber;
          if (type !== 'backgammon' && type !== 'splitcheck') {
            $http.post("/api/" + type + "Room", {"roomNumber" : data.roomNumber})
            .success(function(data) {   
              console.log(data);
              ctrl.roomType = type;  
              $state.go("room." + type, {roomNumber: data.roomNumber,
                                  color: color,
                                  geoRoom: geoRoom,
                                  type: type
                                });
              socket.socket.emit('createRoom', data.roomNumber, geoRoomArr)
              //timerFactory.timerListener();
               })
            .error(function(error){

            })
          }
          else {
            $state.go("room." + type, {roomNumber: data.roomNumber,
                      color: color,
                      geoRoom: geoRoom
            });
         }
        }) 
        .error(function(data){
          console.log("error creating room");
        });  
      }
    }
  });
