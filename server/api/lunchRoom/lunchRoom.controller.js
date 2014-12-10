'use strict';

var _ = require('lodash');
var Lunchroom = require('./lunchRoom.model');
var Room = require('../room/room.model');
var request = require('request');
var foursquareID = process.env.FOURSQUARE_ID;
var foursquareSecret = process.env.FOURSQUARE_SECRET;

// Get list of lunchRooms
exports.index = function(req, res) {
  Lunchroom.find(function (err, lunchRooms) {
    if(err) { return handleError(res, err); }
    return res.json(200, lunchRooms);
  });
};

// Get a single lunchRoom
exports.show = function(req, res) {
  Lunchroom.findOne({roomNumber:req.params.id}, function (err, lunchRoom) {
    if(err) { return handleError(res, err); }
    if(!lunchRoom) { return res.send(404); }
    Room.findOne({roomNumber:req.params.id}, function (err, room) {
      if(err) { return handleError(res, err); }
      if(!room) { return res.status(404).send("room doesn't exist");}
      return res.status(200).send({"room": room, "choices": lunchRoom.choices});
    });
  });
};

// Creates a new lunchRoom in the DB.
exports.create = function(req, res) {
  Lunchroom.create({roomNumber : req.body.roomNumber}, function(err, lunchRoom) {
    if(err) { return handleError(res, err); }
    return res.json(201, lunchRoom);
  });
};

// Updates an existing lunchRoom in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Lunchroom.findOne({roomNumber:req.params.id}, function (err, room) {
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

exports.foursquare = function(req, res) {
  Room.findOne({roomNumber:req.params.id}, function (err, room) {
    if(err) { return handleError(res, err); }
    if(!room) { return res.status(500).send("not OK"); }

    var lat = room.rawLat;
    var lon = room.rawLon;

    var url = 'https://api.foursquare.com/v2/venues/explore?' +
    'll='+ lat + ','+ lon + '&section=food&client_id=' + foursquareID + '&client_secret=' +
    foursquareSecret + '&v=20141120';

    // var url = 'https://api.foursquare.com/v2/venues/trending?' +
    // 'll='+ lat + ','+ lon + '&client_id=' + foursquareID + '&client_secret=' +
    // foursquareSecret + '&v=20141120';


    request.get(url, function(err, response, body) {
      if (err) {
        return res.send(500);
      }
      res.send(body);
    });


    // return res.status(200).send("OK");
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