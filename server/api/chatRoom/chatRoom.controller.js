'use strict';

var _ = require('lodash');
var Chatroom = require('./chatRoom.model');
var Room = require('../room/room.model');

// Get list of chats
exports.index = function(req, res) {
  Chatroom.find(function (err, chats) {
    if(err) { return handleError(res, err); }
    return res.json(200, chats);
  });
};

// Get a single chat
exports.show = function(req, res) {
  Chatroom.findById(req.params.id, function (err, chat) {
    if(err) { return handleError(res, err); }
    if(!chat) { return res.send(404); }
    return res.json(chat);
  });
};

// Creates a new chat in the DB.
exports.create = function(req, res) {
  Chatroom.create(req.body, function(err, chat) {
    if(err) { return handleError(res, err); }
    return res.json(201, chat);
  });
};

// Updates an existing chat in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }

  var message = req.body.message;
  var name = req.body.name;
  var picture = req.body.picture;

  console.log("req.body:", req.body);
  console.log("picture:", picture);

  Room.findOne({roomNumber:req.params.id}, function (err, room) {
    if (err) { return handleError(res, err); }
    if(!room) { return res.send(404); }
    // var updated = _.merge(chat, req.body);
    if (name) {
      room.messages.push({message: message, name: name, picture: picture});
    }
    else {
      room.messages.push({message: message})
    }
    room.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, room);
    });
  });
};

// Deletes a chat from the DB.
exports.destroy = function(req, res) {
  Chatroom.findById(req.params.id, function (err, chat) {
    if(err) { return handleError(res, err); }
    if(!chat) { return res.send(404); }
    chat.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}