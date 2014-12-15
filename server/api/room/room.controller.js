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

// Get a single room by roomId
exports.show = function(req, res) {
  Room.findById(req.params.id, function (err, room) {
    if(err) { return handleError(res, err); }
    if(!room) { return res.status(404).send("room doesn't exist");}
    return res.status(200).send(room);
  });
};

// Get a single room by geolocation
exports.showByGeo = function(req, res) {
  var latLon = req.params.latLon;
  Room.find({'latLonCoords' : {$in: [latLon]} })
       .find({'expired': false})
       .find({'ourExpTime': {$gt : new Date().getTime()}})
       .exec(function (err, rooms) {
    if(err) { return handleError(res, err); }
    if(!rooms) { return res.status(500).send("not OK"); }
    console.log("date: ",  new Date().getTime());
    console.log("rooms: ", rooms);
    return res.json(200, rooms);
  });
};

// Creates a new room in the DB.
exports.create = function(req, res) {
  var lat = req.body.lat;
  var lon = req.body.lon;
  var latLonCoordsArray = req.body.geoRoomArr; 
  var color = req.body.color;
  //var roomNumber = Math.floor(Math.random()*1000000);
  var createdAt = new Date();
  var timerLength = req.body.timerLength;
  var timerMinutes = timerLength.substring(0, timerLength.indexOf(":"));
  var ourExpTime = new Date(new Date().getTime() + (60000 * Number(timerMinutes)) ); //300000);
  var lock = req.body.lock;
  var type = req.body.type;
  var roomName = req.body.roomName;
  Room.create({latLonCoords: latLonCoordsArray,
               rawLat: lat,
               rawLon: lon, 
               color: color,
               createdAt: createdAt,
               ourExpTime: ourExpTime,
               lock: lock,
               type: type,
               roomName: roomName,
               }, function(err, room) {
           if(err) { return handleError(res, err); }
           return res.status(200).send(room);
  });
};

// Updates an existing room in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Room.findById(req.params.id, function (err, room) {
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