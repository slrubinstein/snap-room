'use strict';

angular.module('roomApp')
  .factory('chatroomService', function ($http, socket, $q) {

    return {

      get: function (roomNumber) {
        var deferred = $q.defer();
        var room = {};
        $http.get("/api/chatRoom/" + roomNumber)
         .success(function(data){
          room = data;
          deferred.resolve(room); 
        }).error(function(data){
           $location.path("/");
        });
        return deferred.promise;  
      },
      
     submitInput: function(userInput, roomNumber, name, picture) {
         $http.put('api/chatRoom/' + roomNumber,
           {message: inputForm.textInput.value,
             name: name,
             picture: picture})
         .success(function(data) {
          console.log('submit input success', data)
          // front end model is not being updated on client
          // can either update models in the ctrl, or use a
          // socket.emit on the backend to update ctrl
          socket.socket.emit('updateRoom', roomNumber, {event: 'chat', doc: data})
         })
         .error(function(data) {
           console.log('error');
         });
     },

     toggleColors: function(roomColor, event) {

       var colorClass;

         switch(roomColor) {
           case 'red':
             colorClass = 'redTrim';
             break;
           case 'blue':
             colorClass = 'blueTrim';
             break;
           case 'green':
             colorClass = 'greenTrim';
             break;
         }

         $(event.target).closest('.list-group-item').addClass(colorClass);
         setTimeout(function() {
           $(event.target).closest('.list-group-item').removeClass(colorClass);
         }, 100);
       },
     listen: function(roomNumber, $scope, ctrl, user) {
           socket.socket.on('updateRoom', function(expiredRoomNumber, data) {

             if (data.event==='timeUp') {
                if (Number(expiredRoomNumber) === Number(roomNumber)) {
                  ctrl.timeUp = true;
                }
             }
             if (data.event==='chat') {
               if (Number(expiredRoomNumber) === Number(roomNumber)) {
                 console.log("data: ", data);
                 ctrl.roomData = data.doc;
              }
             }
          });
         }
        }
      });   

