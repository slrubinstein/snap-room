/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Gameboard = require('./gameBoard.model');

exports.register = function(socket) {
  Gameboard.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Gameboard.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socketio, doc, cb) {
	var roomNumber = doc.roomNumber
  //socketio.broadcast.to(roomNumber).emit('updateVotes', doc);
  socketio.to(roomNumber).emit('updateGame', doc);
}

function onRemove(socketio, doc, cb) {
  socketio.emit('room:remove', doc);
}