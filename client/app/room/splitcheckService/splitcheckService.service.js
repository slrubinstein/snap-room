'use strict';

angular.module('roomApp')
  .factory('splitcheckService', function (Auth) {

    return {
      billSoFar: [],
      taxPercent: 8.875,
      tipPercent: 18,
      runningTotal: 0,
      subtotal: 0,
      remainder: 0,
      tipPerPerson: 0,
      totalTax: 0,
      grandTotal: 0,

      submit: function (singleItem) {
        var user = singleItem.user,
            food = singleItem.food,
            price = singleItem.price,
            tax = singleItem.tax

        this.billSoFar.push(singleItem)
        this.updateBillTotals();
        this.updateMyTotals(singleItem);

      },

      updateBillTotals: function() {
        runningTotal = this.calculateRunningTotal();
        remainder: = calculateRemainder();
        //update with socket
      },

      calculateRunningTotal: function() {
        var runningTotal = 0;
          this.billSoFar.forEach(function(item) {
          runningTotal += item.price;
          runningTotal += item.itemTax;
        })
      return runningTotal;
      },

      calculateRemainder: function() {
        return this.subtotal - this.runningTotal;
      }

      deleteItem: function(index) {
        this.billItem.splice(index, 1)
      },

      updateMyTotals: function(item) {

      }
    };
  });
