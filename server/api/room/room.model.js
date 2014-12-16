'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoomSchema = new Schema({
  latLonCoords: [String],
  rawLat: Number,
  rawLon: Number,
  color: String,
  createdAt: {type: Date},
  ourExpTime: {type: Date},
  expired: {type: Boolean, default: false},
  lock: String,
  type: String,
  roomName: String
});


RoomSchema.methods.fourSquareCall = function(cb) {
  var lat = this.rawLat;
  var lon = this.rawLon;
  var rm = this;

  var url = 'https://api.foursquare.com/v2/venues/explore?' +
  'll='+ lat + ','+ lon + '&section=food&client_id=' + foursquareID + '&client_secret=' +
  foursquareSecret + '&v=20141120';

  request.get(url, function(err, body) {
    if (err) {
      cb('error with fourSquare call', null);
    }
    cb(null, body);
  });
}


module.exports = mongoose.model('Room', RoomSchema);