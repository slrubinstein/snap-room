'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChatroomSchema = new Schema({
  roomId: {type: Schema.Types.ObjectId, ref: 'Room'},
  messages: [{message: String, name: String, picture: String}]
});


module.exports = mongoose.model('Chatroom', ChatroomSchema);