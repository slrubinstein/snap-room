'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoomSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  choices: [{choice: String, votes: Number}],
  roomNumber: Number

});

module.exports = mongoose.model('Room', RoomSchema);