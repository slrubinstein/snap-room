/**
 * Socket.io configuration
 */

'use strict';

var Room = require('../api/room/room.model');

var config = require('./environment');

// When the user disconnects.. perform this
function onDisconnect(socket) {
 var roomsObject = socket.nsp.adapter.rooms;
 //if user was only in one room when they disconnected:
 for (var  i = 0; i < Object.keys(roomsObject).length; i++) {
   var roomKey = parseInt(Object.keys(roomsObject)[i]);
   if (!isNaN(roomKey)) {
     var roomNumber = Object.keys(roomsObject)[i];
     var roomObject = socket.nsp.adapter.rooms[roomNumber];
     socket.broadcast.to(roomNumber).emit('newPerson', Object.keys(roomObject).length);
     socket.emit('newPerson', Object.keys(roomObject).length);
   }
 }
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });



  socket.on('createRoom', function(room, color) {
      socket.join(room);
      socket.broadcast.emit('refreshRoomList');
  });

  socket.on('join', function(room) {
    socket.join(room);
    var roomObject = socket.nsp.adapter.rooms[room];
    socket.broadcast.to(room).emit('newPerson', Object.keys(roomObject).length);
    socket.emit('newPerson', Object.keys(roomObject).length);
  })


  socket.on('timeUp', function(room) {
    console.log('time is up')
    Room.findOne({roomNumber:room}, function(err, room) {
      var winner;
      var maxVotes;
      if (room.choices.length > 0) {
        winner = [room.choices[0].choice];
        maxVotes = room.choices[0].votes;
        for (var i = 0; i < room.choices.length; i++) {
          if (room.choices[i].votes > maxVotes) {
            winner[0] = room.choices[i].choice;
            maxVotes = room.choices[i].votes;
          }
          else if (room.choices[i].votes === maxVotes
                  && room.choices[i].choice !== winner[0]) {
            winner.push(room.choices[i].choice);
          }
        }    
      } 
        socket.broadcast.to(room).emit('timeUp', winner, maxVotes);
        socket.emit('timeUp', winner, maxVotes)

        socket.broadcast.to(room).emit('refreshRoomList');
        socket.emit('refreshRoomList'); 
    })

  })

  // Insert sockets below
  require('../api/room/room.socket').register(socket);
  require('../api/thing/thing.socket').register(socket);
}

module.exports = function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket.address);
    });


    // Call onConnect.
    onConnect(socket);
    console.info('[%s] CONNECTED', socket.address);
  });
};