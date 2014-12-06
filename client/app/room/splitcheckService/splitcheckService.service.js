'use strict';

angular.module('roomApp')
  .factory('splitcheckService', function () {

    return {

      bill: {
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
      },

      personalTotals: {
        food: 0,
        tax: 0,
        tip: 0,
        total: 0
      },

      updateSubtotal: function(newSubtotal, newTip, newTax) {
        this.bill.subtotal = newSubtotal;
        this.bill.tipPercent = newTip;
        this.bill.taxPercent = newTax;
        this.updateTax();
        this.updateBillTotals();
      },

      submit: function (singleItem, numberPeople) {
        var user = singleItem.user,
            food = singleItem.food,
            price = singleItem.price,
            tax = singleItem.tax

        this.bill.billSoFar.push(singleItem)
        this.updateBillTotals();

        this.addToMyTotals(singleItem, numberPeople);

      },

      updateBillTotals: function() {
        this.bill.runningTotal = this.calculateRunningTotal();
        this.bill.totalTip = this.calculateTip();
        this.bill.totalTax = this.calculateTax();
        this.bill.grandTotal = this.calculateTotal();
        this.bill.remainder = this.calculateRemainder();
      },

      calculateRunningTotal: function() {
        var runningTotal = 0;
          this.bill.billSoFar.forEach(function(item) {
            runningTotal += Number(item.price);
            runningTotal += Number(item.tax);
          })
      return runningTotal;
      },

      calculateRemainder: function() {
        return this.bill.grandTotal - this.bill.runningTotal;
      },

      calculateTip: function() {
        return this.bill.subtotal * this.bill.tipPercent / 100;
      },

      calculateTax: function() {
        return this.bill.subtotal * this.bill.taxPercent / 100;
      },

      calculateTotal: function() {
        return Number(this.bill.subtotal) + this.bill.totalTip + this.bill.totalTax;
      },

      deleteItem: function(index) {
        var item = this.bill.billSoFar.splice(index, 1)[0]
        this.subtractFromMyTotals(item)
        this.updateBillTotals();
      },

      updateTax: function() {
        var taxPercent = this.bill.taxPercent;
        this.bill.billSoFar.forEach(function(item) {
          item.tax = item.price * taxPercent / 100;
        });
      },

      addToMyTotals: function(item, numberPeople) {
        this.personalTotals.food += item.price;
        this.personalTotals.tax += item.tax;
        this.personalTotals.tip = this.totalTip / numberPeople;
        this.personalTotals.total += item.price + item.tax;
      },

      subtractFromMyTotals: function(item) {
        this.personalTotals.food -= item.price;
        this.personalTotals.tax -= item.tax;
        this.personalTotals.total -= (item.price + item.tax);
      },

      calculateMyTotal: function(name) {
        var srvc = this;
        this.personalTotals = {
          food: 0,
          tax: 0,
          tip: 0,
          total: 0
        }
        this.bill.billSoFar.forEach(function(item) {
          if (item.user===name) {
            srvc.addToMyTotals(item);
          }
        });
        return this.personalTotals;
      },

      updateFromSocket: function(bill) {
        this.bill.billSoFar = bill.billSoFar;
        this.bill.taxPercent = bill.taxPercent;
        this.bill.tipPercent = bill.tipPercent;
        this.bill.runningTotal = bill.runningTotal;
        this.bill.subtotal = bill.subtotal;
        this.bill.remainder = bill.remainder;
        this.bill.totalTip = bill.totalTip;
        this.bill.tipPerPerson = bill.tipPerPerson;
        this.bill.totalTax = bill.totalTax;
        this.bill.grandTotal = bill.grandTotal;
      }
    };
  })
  .factory('splitcheckSockets', function(socket, splitcheckService) {
    
      function sendBillUpdate(roomNumber, bill) {
        socket.socket.emit('updateBill', roomNumber, bill)
      }
    
      function listen(ctrl) {
        socket.socket.on('updateBill', function(bill) {
          splitcheckService.updateFromSocket(bill);
          ctrl.bill = ctrl.updateMyPage();
        })

        socket.socket.on('updateMyBill', function(roomNumber) {
          var bill = splitcheckService.bill;
          sendBillUpdate(roomNumber, bill)
        })
      }

    return {
      sendBillUpdate: sendBillUpdate,
      listen: listen
    }
  });
