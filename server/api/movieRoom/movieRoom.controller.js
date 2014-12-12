'use strict';

var _ = require('lodash');
var Movieroom = require('./movieRoom.model');
var Room = require('../room/room.model');

// Get list of movieRooms
exports.index = function(req, res) {
  Movieroom.find(function (err, movieRooms) {
    if(err) { return handleError(res, err); }
    return res.json(200, movieRooms);
  });
};

// Get a single movieRoom
exports.show = function(req, res) {
  Movieroom.findOne({roomNumber:req.params.id}, function (err, movieRoom) {
    if(err) { return handleError(res, err); }
    if(!movieRoom) { return res.send(404); }
    Room.findOne({roomNumber:req.params.id}, function (err, room) {
      if(err) { return handleError(res, err); }
      if(!room) { return res.status(404).send("room doesn't exist");}
      return res.status(200).send({"room": room, "choices": movieRoom.choices});
    });
  });
};

// Creates a new movieRoom in the DB.
exports.create = function(req, res) {
  Movieroom.create({roomNumber : req.body.roomNumber}, function(err, movieRoom) {
    if(err) { return handleError(res, err); }
    return res.json(201, movieRoom);
  });
};

// Updates an existing movieRoom in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Movieroom.findOne({roomNumber:req.params.id}, function (err, room) {
    if (err) { return handleError(res, err); }
    if(!room) { return res.send(404); }
    var newChoice = true;
    room.choices.forEach(function(choice){
      if (choice.choice === req.body.choice) {
        if (req.body.upOrDown === 'up') {
          choice.votes++;
          newChoice = false;
        } else if (req.body.upOrDown === 'down') {
          choice.votes--;
          newChoice = false;
        }
        if (req.body.name) {
          choice.voters.push(req.body.name);
        }
      }
    });
    if (newChoice) {
      if (req.body.name) {
        room.choices.push({choice: req.body.choice, votes: 1, voters:[req.body.name]});
      }
      else {
        room.choices.push({choice: req.body.choice, votes: 1});
      }  
    }
    //_.merge(room, req.body);
    room.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, room);
    });
  });
};

// Deletes a movieRoom from the DB.
exports.destroy = function(req, res) {
  Movieroom.findById(req.params.id, function (err, movieRoom) {
    if(err) { return handleError(res, err); }
    if(!movieRoom) { return res.send(404); }
    movieRoom.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}