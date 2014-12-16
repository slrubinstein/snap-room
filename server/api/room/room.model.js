'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoomSchema = new Schema({
  // I'd use mongo's lat lon?
  latLonCoords: [String],
  rawLat: Number,
  rawLon: Number,
  color: String,
  createdAt: {type: Date},
  ourExpTime: {type: Date},
  // what if expired was a virtual that made a calculation based on exp time?
  expired: {type: Boolean, default: false},
  lock: String,
  type: String,
  // I'd call this name. you already have room in the model name
  roomName: String
});

RoomSchema.statics.makeExpTime = function(timerLength) {
  var timerMinutes = timerLength.substring(0, timerLength.indexOf(":"));
  return new Date(new Date().getTime() + (60000 * Number(timerMinutes)) );
}


module.exports = mongoose.model('Room', RoomSchema);
