'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoomSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  choices: [{choice: String, votes: Number, voters: [String]}],
  roomNumber: Number,
  lat: Number,
  lon: Number,
  rawLat: Number,
  rawLon: Number,
  color: String,
  createdAt: {type: Date},
  ourExpTime: {type: Date},
  lock: String,
  type: String,
  messages: [{message: String, name: String}]
});

module.exports = mongoose.model('Room', RoomSchema);