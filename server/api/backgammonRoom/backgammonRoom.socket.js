/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Backgammonroom = require('./backgammonRoom.model');

exports.register = function(socket) {
  Backgammonroom.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Backgammonroom.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socketio, doc, cb) {
  var roomNumber = doc.roomNumber
  socketio.to(roomNumber).emit('updateGame', doc);
}

function onRemove(socketio, doc, cb) {
  socketio.emit('room:remove', doc);
}