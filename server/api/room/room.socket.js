/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var room = require('./room.model');

// exports.register = function(socket) {
//   Room.schema.post('save', function (doc) {
//     onSave(socket, doc);
//   });
//   Room.schema.post('remove', function (doc) {
//     onRemove(socket, doc);
//   });
// }

// function onSave(socket, doc, cb) {
// 	var roomNumber = doc.roomNumber
//   socket.emit('room:save' + roomNumber, doc);
// }

// function onRemove(socket, doc, cb) {
//   socket.emit('room:remove', doc);
// }

module.exports = function(socketio) {
  room.schema.post('save', function (doc) {
    socketio.to('room').emit('room:save', doc);
  });
  room.schema.post('remove', function (doc) {
    socketio.to('room').emit('room:remove', doc);
  });
};