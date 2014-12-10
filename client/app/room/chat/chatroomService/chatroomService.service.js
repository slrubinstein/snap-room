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
                 ctrl.timeUp = true;
    //           //in case the user is in multiple rooms (which is not supposed to happen)
    //           if (Number(expiredRoomNumber) === Number(roomNumber)) {
    //             ////////////////////////////////////
    //             $http.get("/api/chatRoom/" + roomNumber)
    //               .success(function(room){
    //                 var winner;
    //                 var maxVotes;
    //                 if (room.choices) {
    //                   if (room.choices.length > 0) {
    //                     winner = [room.choices[0].choice];
    //                     maxVotes = room.choices[0].votes;
    //                     for (var i = 0; i < room.choices.length; i++) {
    //                       if (room.choices[i].votes > maxVotes) {
    //                         winner[0] = room.choices[i].choice;
    //                         maxVotes = room.choices[i].votes;
    //                       }
    //                       else if (room.choices[i].votes === maxVotes
    //                               && room.choices[i].choice !== winner[0]) {
    //                         winner.push(room.choices[i].choice);
    //                       }
    //                     }
    //                   ctrl.winner = winner
    //                   ctrl.maxVotes = maxVotes
    //                   }
    //                 }
    //               })
    //           }
             }
             if (data.event==='chat') {
               console.log("data: ", data);
               ctrl.roomData = data.doc;
             }
          });
     }
    //         //refactor into updateVotes()
    //         console.log("roomNumber from server: ", expiredRoomNumber);
    //         //in case the user is in multiple rooms (which is not supposed to happen)
    //         if (Number(expiredRoomNumber) === Number(roomNumber)) {
    //           console.log('ctrl', ctrl.roomData)
    //           if (ctrl.roomData && data.doc) {
    //             if (ctrl.roomData.choices.length !== data.doc.choices.length) {
    //               ctrl.roomData.choices.push(data.doc.choices[data.doc.choices.length-1]);
    //               $scope.$apply();
    //             }
    //             else {
    //               data.doc.choices.forEach(function(el, index) {
    //                 if (el.votes !== ctrl.roomData.choices[index].votes) {
    //                    ctrl.roomData.choices[index].votes = el.votes;
    //                    ctrl.roomData.choices[index].voters = el.voters;
    //                 }
    //                 else {
    //                   data.doc.choices.forEach(function(el, index) {
    //                     if (el.votes !== ctrl.roomData.choices[index].votes) {
    //                        ctrl.roomData.choices[index].votes = el.votes;
    //                        ctrl.roomData.choices[index].voters = el.voters;
    //                     }
    //                 });
    //               }
    //              });
    //             }
    //           }
    //       }
    //    }
        } //)
      });   

     //}
//  });
