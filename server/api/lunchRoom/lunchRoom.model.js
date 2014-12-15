'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LunchroomSchema = new Schema({
  choices: [{choice: String, votes: Number, voters: [String]}],
  roomId: String
});

LunchroomSchema.index( { roomId: 1 } )

module.exports = mongoose.model('Lunchroom', LunchroomSchema);