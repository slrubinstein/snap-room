'use strict';

angular.module('roomApp')
  .factory('roomSocketsService', function (socket, Auth, usernameVal, $http, $state) {

    return {

       listen: function(roomNumber, $scope, ctrl, user) {

          var name = usernameVal.name;

          socket.socket.emit('join', roomNumber, name);
          
          socket.socket.on('updateRoom', function(expiredRoomNumber, data) {

            if (data.event==='timeUp') {
              //in case the user is in multiple rooms (which is not supposed to happen)
              if (Number(expiredRoomNumber) === Number(roomNumber)) {
                ctrl.timeUp = true
          }
      }
  });
}
}
})