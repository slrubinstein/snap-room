'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoomSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  roomNumber: Number,
  latLonCoords: [String],
  rawLat: Number,
  rawLon: Number,
  color: String,
  createdAt: {type: Date},
  ourExpTime: {type: Date},
  expired: {type: Boolean, default: false},
  lock: String,
  type: String,
  roomName: String
});

module.exports = mongoose.model('Room', RoomSchema);