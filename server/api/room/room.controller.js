'use strict';

var _ = require('lodash');
var Room = require('./room.model');

// Get list of rooms
exports.index = function(req, res) {
  Room.find(function (err, rooms) {
    if(err) { return handleError(res, err); }
    return res.json(200, rooms);
  });
};

// Get a single room
exports.show = function(req, res) {
  Room.findById(req.params.id, function (err, room) {
    if(err) { return handleError(res, err); }
    if(!room) { return res.send(404); }
    return res.json(room);
  });
};

// Creates a new room in the DB.
exports.create = function(req, res) {
  var roomNumber = Math.floor(Math.random()*100);
  Room.create({roomNumber:roomNumber}, function(err, room) {
  //   if(err) { return handleError(res, err); }
  //   return res.json(201, room);
       return res.send(String(roomNumber));
  });
};

// Updates an existing room in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Room.findOne({roomNumber:req.params.id}, function (err, room) {
  //Room.findById(req.params.id, function (err, room) {
    console.log('ROOM', room)
    if (err) { return handleError(res, err); }
    if(!room) { return res.send(404); }
    var newChoice = true;
    room.choices.forEach(function(choice){
      if (choice.choice === req.body.choice) {
        choice.votes++;
        newChoice = false;
      }
    });
    if (newChoice) {
      room.choices.push({choice: req.body.choice, votes: 1});
    }
    //_.merge(room, req.body);
    room.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, room);
    });
  });
};

// Deletes a room from the DB.
exports.destroy = function(req, res) {
  Room.findById(req.params.id, function (err, room) {
    if(err) { return handleError(res, err); }
    if(!room) { return res.send(404); }
    room.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}