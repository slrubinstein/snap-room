'use strict';

var request = require('request');
var foursquareID = process.env.FOURSQUARE_ID;
var foursquareSecret = process.env.FOURSQUARE_SECRET;

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LunchroomSchema = new Schema({
  choices: [{choice: String, votes: Number, voters: [String]}],
  //should be mongodb id, right??
  roomId: String // {type: Schema.Types.ObjectId, ref: 'room'}
});

LunchroomSchema.index( { roomId: 1 } )// you won't need this if you use objectIds

LunchroomSchema.methods.updateVote = function(body, cb) {
  // in general, when using callbacks, I'd pass an actual error object in param one, or null
  // avoid the string 'error'
	if (!this.choices) { cb('error', this) }

  var newChoice = true;
	var rm = this;

  rm.choices.forEach(function(choice){
    if (choice.choice === body.choice) {
      if (body.upOrDown === 'up') {
        choice.votes++;
        newChoice = false;
      } else if (body.upOrDown === 'down') {
        choice.votes--;
        newChoice = false;
      }
      if (body.name) {
      	if (!choice.voters) { cb('error', rm) }
        choice.voters.push(body.name);
      }
    }
  });

  if (newChoice) {
    if (body.name) {
      rm.choices.push({choice: body.choice, votes: 1, voters:[body.name]});
    }
    else {
      rm.choices.push({choice: body.choice, votes: 1});
    }  
  }
  // is anything async happening in this method?
  // I don't see any save calls or anything. don't see reason for cb
  cb(null, rm);
}

LunchroomSchema.statics.fourSquareCall = function(lat, lon, cb) {
  console.log("latlon:", lat, lon)
  var rm = this;

  var url = 'https://api.foursquare.com/v2/venues/explore?' +
  'll='+ lat + ','+ lon + '&section=food&client_id=' + foursquareID + '&client_secret=' +
  foursquareSecret + '&v=20141120';

  request.get(url, function(err, response, body) {
    if (err) {
      cb('error with fourSquare call', null);
    }
    cb(null, body);
  });
}




module.exports = mongoose.model('Lunchroom', LunchroomSchema);




