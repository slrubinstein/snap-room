'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MovieroomSchema = new Schema({
  choices: [{choice: String, votes: Number, voters: [String]}],
  roomNumber: Number
});

module.exports = mongoose.model('Movieroom', MovieroomSchema);