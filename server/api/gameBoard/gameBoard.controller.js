'use strict';

var _ = require('lodash');
var Gameboard = require('./gameBoard.model');

// Get list of gameBoards
exports.index = function(req, res) {
  Gameboard.find(function (err, gameBoards) {
    if(err) { return handleError(res, err); }
    return res.json(200, gameBoards);
  });
};

// Get a single gameBoard
exports.show = function(req, res) {
  var roomNumber = req.params.id;
  Gameboard.findOne({roomNumber: roomNumber}, function (err, gameBoard) {
    if(err) { return handleError(res, err); }
    if(!gameBoard) { return res.send(404); }
    return res.json(gameBoard);
  });
};

// Creates a new gameBoard in the DB.
exports.create = function(req, res) { 
  Gameboard.create({}, function(err, gameBoard) {
    if(err) { return handleError(res, err); }
    if(!gameBoard) { return res.send(404); }
    //gameBoard.players.push(req.user.name);
    var updated = _.merge(gameBoard, req.body);
    updated.roomNumber = req.body.roomNumber;
    updated.isActive = true;
    updated.save(function(err, updatedGameboard){
      if (err) { return handleError(res, err); }
      return res.json(201, updatedGameboard);
    });
  });
};

// Updates an existing gameBoard in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Gameboard.findOne({roomNumber:req.body.roomNumber}, function (err, gameBoard) {
    if (err) { return handleError(res, err); }
    if(!gameBoard) { return res.send(404); }
    var updated = _.merge(gameBoard, req.body);
    updated.save(function (err, updatedGameboard) {
      if (err) { return handleError(res, err); }
      if(!updatedGameboard) { return res.send(404); }
      return res.json(200, gameBoard);
    });
  });
};

// Deletes a gameBoard from the DB.
exports.destroy = function(req, res) {
  Gameboard.findById(req.params.id, function (err, gameBoard) {
    if(err) { return handleError(res, err); }
    if(!gameBoard) { return res.send(404); }
    gameBoard.remove(function(err) {
      if(err) { return handleError(res, err); }
      if(!updateGameboard) { return res.send(404); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}