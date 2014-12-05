'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameboardSchema = new Schema({
    players : [],
    isActive: Boolean,
    turn : String,
    roll : {rollArray : [Number]},
    numberRolls : Number,
    pieces : {piecesArray: [Number]},
    piecesColor : {piecesColorArr: [String]}, 
    greenHomeNumber : Number,
    blueHomeNumber : Number,
    greenPiecesInJail : Number,
    bluePiecesInJail : Number,
    blueScore : Number,
    greenScore : Number,
    roomNumber : Number
});

module.exports = mongoose.model('Gameboard', GameboardSchema);