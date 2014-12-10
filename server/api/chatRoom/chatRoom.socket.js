/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Chatroom = require('./chatRoom.model');

exports.register = function(socket) {
  Chatroom.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Chatroom.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
 // socket.emit('chatRoom:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('chatRoom:remove', doc);
}