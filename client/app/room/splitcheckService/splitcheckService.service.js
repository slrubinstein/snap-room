'use strict';

angular.module('roomApp')
  .factory('splitcheckService', function () {

    return {


      billSoFar: [],
      taxPercent: 8.875,
      tipPercent: 18,
      runningTotal: 0,
      subtotal: 0,
      remainder: 0,
      totalTip: 0,
      tipPerPerson: 0,
      totalTax: 0,
      grandTotal: 0,

      updateSubtotal: function(newSubtotal) {
        this.subtotal = newSubtotal;
        this.updateBillTotals();
      },

      submit: function (singleItem) {
        var user = singleItem.user,
            food = singleItem.food,
            price = singleItem.price,
            tax = singleItem.tax

        this.billSoFar.push(singleItem)
        this.updateBillTotals();

        // this.updateMyTotals(singleItem);

      },

      updateBillTotals: function() {
        this.runningTotal = this.calculateRunningTotal();
        this.remainder = this.calculateRemainder();
        this.totalTip = this.calculateTip();
        this.totalTax = this.calculateTax();
        this.grandTotal = this.calculateTotal();
        //update everyone with socket

      },

      calculateRunningTotal: function() {
        var runningTotal = 0;
          this.billSoFar.forEach(function(item) {
            runningTotal += item.price;
            runningTotal += item.tax;
          })
      return runningTotal;
      },

      calculateRemainder: function() {
        return this.subtotal - this.runningTotal;
      },

      calculateTip: function() {
        return this.subtotal * this.tipPercent / 100;
      },

      calculateTax: function() {
        return this.subtotal * this.taxPercent / 100;
      },

      calculateTotal: function() {
        return Number(this.subtotal) + this.totalTip + this.totalTax;
      },

      deleteItem: function(index) {
        this.billSoFar.splice(index, 1)
        this.updateBillTotals();
      },

      updateMyTotals: function(item) {

      },

      updateFromSocket: function(bill) {
        this.billSoFar = bill.billSoFar;
        this.taxPercent = bill.taxPercent;
        this.tipPercent = bill.tipPercent;
        this.runningTotal = bill.runningTotal;
        this.subtotal = bill.subtotal;
        this.remainder = bill.remainder;
        this.totalTip = bill.totalTip;
        this.tipPerPerson = bill.tipPerPerson;
        this.totalTax = bill.totalTax;
        this.grandTotal = bill.grandTotal;
      }
    };
  })
  .factory('splitcheckSockets', function(socket, splitcheckService) {
    return {
      sendBillUpdate: function(roomNumber, bill) {
        console.log('bill', bill)
        socket.socket.emit('updateBill', roomNumber, bill)
      },

      listen: function(ctrl) {
        socket.socket.on('updateBill', function(bill) {
          splitcheckService.updateFromSocket(bill);
          ctrl.bill = ctrl.updateMyPage();
        })
      }
    }
  });
