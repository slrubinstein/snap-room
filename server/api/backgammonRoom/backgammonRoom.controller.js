'use strict';

var _ = require('lodash');
var Backgammonroom = require('./backgammonRoom.model');

// Get list of backgammonRooms
exports.index = function(req, res) {
  Backgammonroom.find(function (err, backgammonRooms) {
    if(err) { return handleError(res, err); }
    return res.json(200, backgammonRooms);
  });
};

// Get a single backgammonRoom
exports.show = function(req, res) {
  var roomNumber = req.params.id;
  Backgammonroom.findOne({roomNumber: roomNumber}, function (err, backgammonRoom) {
    if(err) { return handleError(res, err); }
    if(!backgammonRoom) { return res.send(404); }
    return res.json(backgammonRoom);
  });
};

// Creates a new backgammonRoom in the DB.
exports.create = function(req, res) { 
  Backgammonroom.create({}, function(err, backgammonRoom) {
    if(err) { return handleError(res, err); }
    if(!backgammonRoom) { return res.send(404); }
    //backgammonRoom.players.push(req.user.name);
    var updated = _.merge(backgammonRoom, req.body);
    updated.roomNumber = req.body.roomNumber;
    updated.save(function(err, updatedBackgammonRoom){
      if (err) { return handleError(res, err); }
      return res.json(201, updatedBackgammonRoom);
    });
  });
};

// Updates an existing backgammonRoom in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  var roomNumber = req.params.id;
  Backgammonroom.findOne({roomNumber: roomNumber}, function (err, backgammonRoom) {
    if (err) { return handleError(res, err); }
    if(!backgammonRoom) { return res.send(404); }
    var updated = _.merge(backgammonRoom, req.body);
    updated.save(function (err, updatedBackgammonRoom) {
      if (err) { return handleError(res, err); }
      if(!updatedBackgammonRoom) { return res.send(404); }
      return res.json(200, updatedBackgammonRoom);
    });
  });
};

// Deletes a backgammonRoom from the DB.
exports.destroy = function(req, res) {
  Backgammonroom.findById(req.params.id, function (err, backgammonRoom) {
    if(err) { return handleError(res, err); }
    if(!backgammonRoom) { return res.send(404); }
    backgammonRoom.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}