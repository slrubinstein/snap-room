'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoomSchema = new Schema({
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

RoomSchema.statics.makeExpTime = function(timerLength) {
  var timerMinutes = timerLength.substring(0, timerLength.indexOf(":"));
  return new Date(new Date().getTime() + (60000 * Number(timerMinutes)) );
}


module.exports = mongoose.model('Room', RoomSchema);