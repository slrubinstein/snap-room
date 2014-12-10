/**
 * Socket.io configuration
 */

'use strict';

var Room = require('../api/room/room.model');
var Lunchroom = require('../api/lunchRoom/lunchRoom.model');

var config = require('./environment');

// When the user disconnects.. perform this
function onDisconnect(socket, findUsernamesInRoom) {

 var roomNumber = socket.roomNumber;

 var roomsObject = socket.nsp.adapter.rooms;
 var name = socket.nickname;

 var nameArray = findUsernamesInRoom(socket, roomNumber)
 socket.broadcast.to(roomNumber).emit('countPeople', nameArray.length, nameArray);
}

// When the user connects.. perform this
function onConnect(socket, socketio, findUsernamesInRoom) {
  // When the client emits 'info', this listens and executes
  // socket.on('info', function (data) {
  //   console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  // });


  //emitted when user goes to main page
  socket.on('joinGeoRoom', function(geoRoom) {
    socket.join(geoRoom);
  })

  //emitted when user goes to main page. If they've navigated
  //out of a room, remaining users in room will be given an updated
  //list of users in that room
  socket.on('onMainPage', function() {
    //roomObject has all socket rooms that this user is in
    var roomsObject = socket.nsp.adapter.rooms;
    //roomNumber will be undefined if user hasn't navigated from a room
    var roomNumber = socket.roomNumber;
    socket.leave(roomNumber);
    var nameArray = findUsernamesInRoom(socket, roomNumber);
    socket.broadcast.to(roomNumber).emit('countPeople', nameArray.length, nameArray);
  })
 
  //emitted when user creates a new room, after call to database in which
  //roomNumber is assigned and room document is created
  socket.on('createRoom', function(roomNumber, geoRoomArr) {
      socket.join(roomNumber);
      //to notify all users in geographic area to check database
      notifyToCheckDatabase(geoRoomArr);
  });

  function notifyToCheckDatabase(geoRoomArr) {
    geoRoomArr.forEach(function(el) {
      socket.broadcast.to(el).emit('refreshRoomList');
    })
  }

  //emitted when user enters a room
  socket.on('join', function(roomNumber, name) {
    socket.join(roomNumber);
    socket.nickname = name;
    socket.roomNumber = roomNumber;

    var nameArray = findUsernamesInRoom(socket, roomNumber);
    socket.broadcast.to(roomNumber).emit('countPeople', nameArray.length, nameArray);
    socket.emit('countPeople', nameArray.length, nameArray);
  })

  socket.on('timeUp', function(roomNumber, geoRoomArr) {
    var data;
    Room.findOne({"roomNumber":roomNumber}, function(err, room) {
      if (!room.expired) {
        console.log(room)
        console.log(room.type)
        room.expired = true;
        room.save(function(err, room) {
          if (room.type === 'lunch') {
            calcWinner(roomNumber, geoRoomArr);
          }
          else {
            socket.broadcast.to(roomNumber).emit('timeUp', roomNumber, data);
            socket.emit('timeUp', roomNumber, data);

            geoRoomArr.forEach(function(el) {
              socket.broadcast.to(el).emit('refreshRoomList');
            });

            socket.emit('refreshRoomList');
          } 
        }) 
      }
    })
  })

  //for any type of room in which there is voting
  function calcWinner(roomNumber, geoRoomArr) {
    var winner;
    var maxVotes;
    Lunchroom.findOne({"roomNumber":roomNumber}, function(err, room) {
      if (room.choices) {
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
      } 
     
      var data = {"winner" : winner, "maxVotes" : maxVotes};
      socket.broadcast.to(roomNumber).emit('timeUp', roomNumber, data);
      socket.emit('timeUp', roomNumber, data);

      geoRoomArr.forEach(function(el) {
        socket.broadcast.to(el).emit('refreshRoomList');
      });

      socket.emit('refreshRoomList');
    })
  };
  // Split Check Sockets


  socket.on('updateRoom', function(roomNumber, data) {
    socket.broadcast.to(roomNumber).emit('updateRoom', roomNumber, data);
    socket.emit('updateRoom', roomNumber, data);
  })

  // Insert sockets below
  require('../api/chatRoom/chatRoom.socket').register(socket);
  require('../api/gameBoard/gameBoard.socket').register(socket);
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

    function findUsernamesInRoom(socket, roomNumber) {
      var socketIdsInRoom = socket.nsp.adapter.rooms[roomNumber];
      var nameArray = []
      for (var socketID in socketIdsInRoom) {
        //find the name associated with each socketID, and push to nameArray
        nameArray.push(socketio.sockets.connected[socketID].nickname);
      }
      return nameArray;
    } 


    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket, findUsernamesInRoom);
      console.info('[%s] DISCONNECTED', socket.address);
    });


    // Call onConnect.
    onConnect(socket, socketio, findUsernamesInRoom);
    console.info('[%s] CONNECTED', socket.address);
  });
  require('../api/chatRoom/chatRoom.socket').register(socketio);
  require('../api/room/room.socket').register(socketio);
  require('../api/thing/thing.socket').register(socketio);
  require('../api/lunchRoom/lunchRoom.socket').register(socketio);
};