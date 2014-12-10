'use strict';

angular.module('roomApp')
  .factory('roomSocketsService', function (socket, Auth, usernameVal) {

    return {

      listen: function(roomNumber, $scope, ctrl, user) {
        socket.socket.on('timeUp', function(expiredRoomNumber, data) {
          //in case the user is in multiple rooms (which is not supposed to happen)
          if (Number(expiredRoomNumber) === Number(roomNumber)) {
            ctrl.timeUp = true
            ////////////////////////////////////
            if (ctrl.roomType === 'lunch') {
              ctrl.winner = data.winner;
              ctrl.maxVotes = data.maxVotes;
            }
            ////////////////////////////////////
          }
        });

        var name = usernameVal.name;
        socket.socket.emit('join', roomNumber, name);
        
        socket.socket.on('updateRoom', function(roomNumber, data) {
          if (data.event==='vote') {
            //refactor into updateVotes()
            console.log(ctrl.roomData, 'roomData')
            console.log(data.doc, 'data.doc')
            if (ctrl.roomData.choices.length !== data.doc.choices.length) {
              console.log('if')
              ctrl.roomData.choices.push(data.doc.choices[data.doc.choices.length-1]);
              $scope.$apply();
            }
            else {
              console.log('else')
              data.doc.choices.forEach(function(el, index) {
                if (el.votes !== ctrl.roomData.choices[index].votes) {
                   ctrl.roomData.choices[index].votes = el.votes;
                   ctrl.roomData.choices[index].voters = el.voters;
                }
              });
            }
          }
          if (data.event==='timeUp') {

          }
        })

        function updateVotes(data) {

        }


        //   else if (ctrl.roomType==='chat') {
        //     ctrl.roomData = roomData;
        //     $scope.$apply();
        //   }
        // });
      }
    };
  });
