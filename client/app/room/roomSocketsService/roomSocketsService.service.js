'use strict';

angular.module('roomApp')
  .factory('roomSocketsService', function (socket, Auth, usernameVal) {

    return {

      listen: function(roomNumber, $scope, ctrl, user) {
        socket.socket.on('timeUp', function(expiredRoomNumber, data) {
          console.log(expiredRoomNumber)
          console.log(data);
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
        // if (user.hasOwnProperty('facebook')) {
        //   var name = user.facebook.first_name + ' ' + user.facebook.last_name[0] + '.';
        // } else {
        //   var name = 'anonymous';
        // }
        console.log('socket service name', name)
        socket.socket.emit('join', roomNumber, name);
        
        socket.socket.on('updateVotes', function(roomData) {

          if (ctrl.roomType==='lunch') {
            if (ctrl.roomData.choices.length !== roomData.choices.length) {
              ctrl.roomData.choices.push(roomData.choices[roomData.choices.length-1]);
              $scope.$apply();
            }
            else {
              roomData.choices.forEach(function(el, index) {
                if (el.votes !== ctrl.roomData.choices[index].votes) {
                   ctrl.roomData.choices[index].votes = el.votes;
                   ctrl.roomData.choices[index].voters = el.voters;
                }
              });
            }
          }

          else if (ctrl.roomType==='chat') {
            ctrl.roomData = roomData;
            $scope.$apply();
          }
        });
      }
    };
  });
