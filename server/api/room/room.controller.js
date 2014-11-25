'use strict';

var _ = require('lodash');
var Room = require('./room.model');
var request = require('request');
var foursquareID = process.env.FOURSQUARE_ID;
var foursquareSecret = process.env.FOURSQUARE_SECRET;

// Get list of rooms
exports.index = function(req, res) {
  Room.find(function (err, rooms) {
    if(err) { return handleError(res, err); }
    return res.json(200, rooms);
  });
};

// Get a single room by roomNumber
exports.show = function(req, res) {
  Room.findOne({roomNumber:req.params.id}, function (err, room) {
    if(err) { return handleError(res, err); }
    if(!room) { return res.status(500).send("not OK"); }
    return res.status(200).send(room);
  });
};

// Get a single room by geolocation
exports.showByGeo = function(req, res) {
  Room.find({lat:req.params.lat})
       .find({'expiresAt': {$gt : new Date().getTime()}})
       .exec(function (err, rooms) {
    if(err) { return handleError(res, err); }
    if(!rooms) { return res.status(500).send("not OK"); }
    if (rooms.length > 0) {
      console.log(rooms[0].expiresAt);
      console.log(new Date().getTime());
      console.log(rooms[0].expiresAt - new Date().getTime());
    }
    return res.status(200).send(rooms);
  });
};

// Creates a new room in the DB.
exports.create = function(req, res) {
  var lat = req.body.lat; 
  var lon = req.body.lon;
  var color = req.body.color;
  var roomNumber = Math.floor(Math.random()*100);
  var createdAt = new Date();
  var expiresAt = new Date(new Date().getTime() + 15000); //300000);
  console.log(expiresAt)
  Room.create({roomNumber:roomNumber,
               lat: lat.toFixed(1), 
               lon: lon.toFixed(1),
               rawLat: lat,
               rawLon: lon, 
               color: color,
               createdAt: createdAt,
               expiresAt: expiresAt
               }, function(err, room) {
     if(err) { return handleError(res, err); }
  //   return res.json(201, room);
    return res.status(200).send({roomNumber: roomNumber});
  });
};

// Updates an existing room in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Room.findOne({roomNumber:req.params.id}, function (err, room) {
  //Room.findById(req.params.id, function (err, room) {
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

function handleError(res, err) {
  return res.send(500, err);
}