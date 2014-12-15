'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChatroomSchema = new Schema({
  roomId: String,
  messages: [{message: String, name: String, picture: String}]
});


ChatroomSchema.index( { roomId: 1 } )


module.exports = mongoose.model('Chatroom', ChatroomSchema);