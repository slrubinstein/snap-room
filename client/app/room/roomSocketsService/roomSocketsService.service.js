'use strict';

angular.module('roomApp')
  .factory('roomSocketsService', function (socket, usernameVal) {

    return {

       listen: function(roomId, ctrl) {

          var name = usernameVal.name;

          socket.socket.emit('join', roomId, name);
          
          socket.socket.on('updateRoom', function(eventRoomId, data) {

            if (data.event==='timeUp') {

              if (eventRoomId === roomId) {
                ctrl.timeUp = true
             }
      }
  });
}
}
})