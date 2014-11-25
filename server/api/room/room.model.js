'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoomSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  choices: [{choice: String, votes: Number}],
  roomNumber: Number,
  lat: Number,
  lon: Number,
  rawLat: Number,
  rawLon: Number,
  color: String,
  createdAt: {type: Date},
  expiresAt: {type: Date}
});

module.exports = mongoose.model('Room', RoomSchema);