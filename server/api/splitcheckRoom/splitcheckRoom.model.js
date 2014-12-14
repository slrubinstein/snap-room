'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SplitcheckroomSchema = new Schema({
  bill: {},
  roomId: String
});

module.exports = mongoose.model('Splitcheckroom', SplitcheckroomSchema);