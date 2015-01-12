'use strict';

angular.module('roomApp')
  .factory('chatroomService', function ($http, socket, $q, $location) {

    return {

      get: function (roomId) {
        var deferred = $q.defer();
        var room = {};
        $http.get("/api/chatRoom/" + roomId)
         .success(function(data){
          room = data;
          deferred.resolve(room); 
        }).error(function(data){
           $location.path("/");
        });
        return deferred.promise;  
      },
      
     submitInput: function(userInput, roomId, name, picture) {
         return $http.put('api/chatRoom/' + roomId,
           {message: userInput,
             name: name,
             picture: picture})
     },

     listen: function(roomId, ctrl, user) {
         socket.socket.on('updateRoom', function(eventRoomId, data) {
           if (data.event==='timeUp') {
              //to prevent events in a different room 
              //from affecting this room
              if (eventRoomId === roomId) {
                ctrl.timeUp = true;
              }
           }
           if (data.event==='chat') {
              //to prevent events in a different room 
              //from affecting this room
              if (eventRoomId === roomId) {
                ctrl.roomData = data.doc.data;
              }
           }
        });
      }
    }
  });   

