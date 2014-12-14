'use strict';

var _ = require('lodash');
var Splitcheckroom = require('./splitcheckRoom.model');

// Get list of splitcheckRooms
exports.index = function(req, res) {
  Splitcheckroom.find(function (err, splitcheckRooms) {
    if(err) { return handleError(res, err); }
    return res.json(200, splitcheckRooms);
  });
};

// Get a single splitcheckRoom
exports.show = function(req, res) {
  Splitcheckroom.findOne({roomId: req.params.id}, function (err, splitcheckRoom) {
    if(err) { return handleError(res, err); }
    if(!splitcheckRoom) { return res.send(404); }
    return res.json(splitcheckRoom);
  });
};

// Creates a new splitcheckRoom in the DB.
exports.create = function(req, res) {
  Splitcheckroom.create({roomId: req.body.roomId}, function(err, splitcheckRoom) {
    if(err) { return handleError(res, err); }
    return res.json(201, splitcheckRoom);
  });
};

// Updates an existing splitcheckRoom in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Splitcheckroom.findById(req.params.id, function (err, splitcheckRoom) {
    if (err) { return handleError(res, err); }
    if(!splitcheckRoom) { return res.send(404); }
    var updated = _.merge(splitcheckRoom, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, splitcheckRoom);
    });
  });
};

// Deletes a splitcheckRoom from the DB.
exports.destroy = function(req, res) {
  Splitcheckroom.findById(req.params.id, function (err, splitcheckRoom) {
    if(err) { return handleError(res, err); }
    if(!splitcheckRoom) { return res.send(404); }
    splitcheckRoom.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}