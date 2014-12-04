/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Room = require('./room.model');

exports.register = function(socketio) {
  Room.schema.post('save', function (doc) {
    onSave(socketio, doc);
  });
  Room.schema.post('remove', function (doc) {
    onRemove(socketio, doc);
  });
}

function onSave(socketio, doc, cb) {
	var roomNumber = doc.roomNumber
  //socketio.broadcast.to(roomNumber).emit('updateVotes', doc);
  socketio.to(roomNumber).emit('updateVotes', doc);
}

function onRemove(socketio, doc, cb) {
  socketio.emit('room:remove', doc);
}