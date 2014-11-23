/**
 * Socket.io configuration
 */

'use strict';

var Room = require('../api/room/room.model');

var config = require('./environment');

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });


  // create a new room
  socket.on('create', function(room, color) {

    console.log('Creating ' + color + ' room number', room)

    // add this room to the database
    Room.findOne({roomNumber:room}, function(err, room) {
      room.people.push(socket.id);
      room.save();
    })

    // creator joins room
    socket.join(room);

    // initiate votes count
    // socket.votes = 0;

    // send new room to the landing page
    socket.broadcast.emit('newRoomCreated');
  });

  // join an existing room
  socket.on('join', function(room) {
    console.log('Joining room number', room)
    socket.join(room);

    // add new person to room in database
    Room.findOne({roomNumber:room}, function(err, room) {
      room.people.push(socket.id);
      room.save();
    })
  });

  socket.on('leave', function(room) {
    socket.leave(room);

    // remove person from room in database
    Room.findOne({roomNumber:room}, function(err, room) {
      room.people.splice(room.people.indexOf(socket.id, 1));
      room.save();
    });
  });

  socket.on('sendMsg', function(data) {
    // if (socket.votes < 3) {
      var room = data.room;
      var msg = data.msg;
      var votes = 0;

      // save choice to database
      Room.findOne({roomNumber:room}, function(err, room) {
        var newChoice = true;
        room.choices.forEach(function(choice){
          if (choice.choice === msg) {
            choice.votes++;
            newChoice = false;
            votes = choice.votes;
          };
        });        
        if (newChoice) {
          room.choices.push({choice: msg, votes: 1});
          votes = 1;
        }
        room.save();
      })

      // give users only one vote
      // socket.votes++;

      socket.broadcast.to(room).emit('msg', msg, votes);
      socket.emit('msg', msg);
    // }
  });


  // Insert sockets below

}
  // require('../api/room/room.socket.js').register(socket);
  // require('../api/thing/thing.socket').register(socket);


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
  require('../api/room/room.socket')(socketio);
}
