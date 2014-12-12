/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Movieroom = require('./movieRoom.model');

exports.register = function(socket) {
  Movieroom.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Movieroom.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('movieRoom:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('movieRoom:remove', doc);
}