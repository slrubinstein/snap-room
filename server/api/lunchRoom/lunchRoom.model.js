'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LunchroomSchema = new Schema({
  choices: [{choice: String, votes: Number, voters: [String]}],
  roomId: String
});

module.exports = mongoose.model('Lunchroom', LunchroomSchema);