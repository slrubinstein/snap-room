/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Lunchroom = require('./lunchRoom.model');

exports.register = function(socketio) {
  Lunchroom.schema.post('save', function (doc) {
    onSave(socketio, doc);
  });
  Lunchroom.schema.post('remove', function (doc) {
    onRemove(socketio, doc);
  });
}

function onSave(socketio, doc, cb) {
	console.log("onSave");
	var roomNumber = doc.roomNumber
  //socketio.broadcast.to(roomNumber).emit('updateVotes', doc);
  socketio.to(roomNumber).emit('updateVotes', doc);
}

function onRemove(socketio, doc, cb) {
  socketio.emit('room:remove', doc);
}
