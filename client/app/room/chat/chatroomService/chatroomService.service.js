'use strict';

angular.module('roomApp')
  .factory('chatroomService', function ($http, socket) {

    return {
submitInput: function(userInput, roomNumber, name, picture, type) {
       if (type === 'lunch') {
         $http.put("/api/room/" + roomNumber, 
           {choice : userInput,
             name : name})
           .success(function(data){
              console.log('submitting', data)
              // front end model is not being updated on client
              // can either update models in the ctrl, or use a
              // socket.emit on the backend to update ctrl
              socket.socket.emit('updateRoom', roomNumber, {event: 'vote', doc: data})
         })
         .error(function(data){
             console.log("error");
         });
       }
       else if (type === 'chat') {
         $http.put('api/chat/' + roomNumber,
           {message: inputForm.textInput.value,
             name: name,
             picture: picture})
         .success(function(data) {
           // console.log(data)
         })
         .error(function(data) {
           console.log('error');
         });
       }
     },

     submitVote: function(roomNumber, choice, upOrDown, name) {
       $http.put("/api/room/" + roomNumber, 
         {choice : choice,
           name: name,
           upOrDown: upOrDown})
         .success(function(data){
          socket.socket.emit('updateRoom', roomNumber, {event: 'vote', doc: data})
         })
         .error(function(data){
             console.log("error");
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
       }
     }
  });
