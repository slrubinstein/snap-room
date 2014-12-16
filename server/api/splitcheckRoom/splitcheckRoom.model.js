'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SplitcheckroomSchema = new Schema({
  bill: {
    billSoFar: Array,
    taxPercent: {type: Number, default: 8.875},
    tipPercent: {type: Number, default: 18},
    runningTotal: {type: Number, default: 0},
    subtotal: {type: Number, default: 0},
    remainder: {type: Number, default: 0},
    totalTip: {type: Number, default: 0},
    tipPerPerson: {type: Number, default: 0},
    totalTax: {type: Number, default: 0},
    grandTotal: {type: Number, default: 0},
  },
  roomId: {type: Schema.Types.ObjectId, ref: 'Room'}
});

module.exports = mongoose.model('Splitcheckroom', SplitcheckroomSchema);