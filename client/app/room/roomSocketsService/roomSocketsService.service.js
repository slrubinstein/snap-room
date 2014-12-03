'use strict';

angular.module('roomApp')
  .factory('roomSocketsService', function (socket) {

    return {

      listen: function(roomNumber, $scope, ctrl) {
      
        socket.socket.on('timeUp', function(winner, maxVotes, expiredRoomNumber) {
          if (Number(expiredRoomNumber) === Number(roomNumber)) {
            ctrl.timeUp = true;
            ctrl.winner = winner;
            ctrl.maxVotes = maxVotes;
          }
        });

        socket.socket.on('timeUpChat', function(expiredRoomNumber) {
          if (Number(expiredRoomNumber) === Number(roomNumber)) {
            ctrl.timeUp = true;
          }
        });

        socket.socket.emit('join', roomNumber);
        
        socket.socket.on('newPerson', function(numberPeople) {
          ctrl.numberPeople = numberPeople;
          $scope.$apply();
        });
        
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
