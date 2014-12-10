'use strict';

var _ = require('lodash');
var Chatroom = require('./chatRoom.model');
var Room = require('../room/room.model');

// Get list of chatrooms
exports.index = function(req, res) {
  Chatroom.find(function (err, chats) {
    if(err) { return handleError(res, err); }
    return res.json(200, chats);
  });
};

// Get a single chatroom
exports.show = function(req, res) {
  Chatroom.findOne({"roomNumber": req.params.id}, function (err, chat) {
    if(err) { return handleError(res, err); }
    if(!chat) { return res.send(404); }
    return res.json(chat);
  });
};

// Creates a new chatroom in the DB.
exports.create = function(req, res) {
  Chatroom.create({"roomNumber" : req.body.roomNumber}, function(err, chat) {
    if(err) { return handleError(res, err); }
    return res.json(201, chat);
  });
};

// Updates an existing chatroom in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }

  var message = req.body.message;
  var name = req.body.name;
  var picture = req.body.picture;

  Chatroom.findOne({roomNumber:req.params.id}, function (err, room) {
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
      console.log(room);
      return res.json(200, room);
    });
  });
};

// Deletes a chatroom from the DB.
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