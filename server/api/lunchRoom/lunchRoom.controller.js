'use strict';

var _ = require('lodash');
var Lunchroom = require('./lunchRoom.model');
var Room = require('../room/room.model');

// Get list of lunchRooms
exports.index = function(req, res) {
  Lunchroom.find(function (err, lunchRooms) {
    if(err) { return handleError(res, err); }
    return res.json(200, lunchRooms);
  });
};

// Get a single lunchRoom
exports.show = function(req, res) {
  Lunchroom.findOne({roomId:req.params.id}, function (err, lunchRoom) {
    if(err) { return handleError(res, err); }
    if(!lunchRoom) { return res.send(404); }
    return res.status(200).send({"room": lunchRoom, "choices": lunchRoom.choices});
  });
};

// Creates a new lunchRoom in the DB.
exports.create = function(req, res) {
  Lunchroom.create({roomId : req.body.roomId}, function(err, lunchRoom) {
    if(err) { return handleError(res, err); }
    return res.json(201, lunchRoom);
  });
};

// Updates an existing lunchRoom in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Lunchroom.findOne({roomId:req.params.id}, function (err, room) {
    if (err) { return handleError(res, err); }
    if(!room) { return res.send(404); }

    room.updateVote(req.body, function(err, room) {
      if (err) { return handleError(res, err); }
      if(!room) { return res.send(404); }

      room.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, room);
      });
    });

  })
};

exports.foursquare = function(req, res) {
  Room.findById(req.params.id, function (err, room) {
    if(err) { return handleError(res, err); }
    if(!room) { return res.status(500).send("not OK"); }

    var lat = room.rawLat;
    var lon = room.rawLon;

    Lunchroom.fourSquareCall(lat, lon, function(err, body) {
      if (err) {
        console.log(err);
        res.send(500);
      }
      res.status(200).send(body);
    });
    
  });
};

// Deletes a lunchRoom from the DB.
exports.destroy = function(req, res) {
  Lunchroom.findById(req.params.id, function (err, lunchRoom) {
    if(err) { return handleError(res, err); }
    if(!lunchRoom) { return res.send(404); }
    lunchRoom.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}