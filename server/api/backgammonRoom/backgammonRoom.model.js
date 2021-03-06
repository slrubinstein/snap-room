'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BackgammonroomSchema = new Schema({
    turn : String,
    roll : {rollArray : [Number]},
    showRollButton: Boolean,
    numberRolls : Number,
    pieces : {piecesArray: [Number]},
    piecesColor : {piecesColorArr: [String]}, 
    greenHomeNumber : Number,
    blueHomeNumber : Number,
    greenPiecesInJail : Number,
    bluePiecesInJail : Number,
    blueScore : Number,
    greenScore : Number,
    roomId : {type: Schema.Types.ObjectId, ref: 'Room'}
});

module.exports = mongoose.model('Backgammonroom', BackgammonroomSchema);