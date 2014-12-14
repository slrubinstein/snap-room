/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Splitcheckroom = require('./splitcheckRoom.model');

exports.register = function(socket) {
  Splitcheckroom.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Splitcheckroom.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('splitcheckRoom:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('splitcheckRoom:remove', doc);
}