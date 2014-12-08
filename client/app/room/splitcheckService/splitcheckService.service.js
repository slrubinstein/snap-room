'use strict';

angular.module('roomApp')
  .factory('splitcheckService', function () {


    // TO DO:

    // move numberPeople in room to own factory
    // reference numberPeople from factory
    // test/debug

    var bill = {
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
      };

    var personalTotals = {
        food: 0,
        tax: 0,
        tip: 0,
        total: 0
      };


    function updateSubtotal(newSubtotal, newTip, newTax, numberPeople) {
        bill.subtotal = newSubtotal;
        bill.tipPercent = newTip;
        bill.taxPercent = newTax;
        updateTax();
        updateBillTotals(numberPeople);
      }

      function submit(singleItem, numberPeople) {
        var user = singleItem.user,
            food = singleItem.food,
            price = singleItem.price,
            tax = singleItem.tax;

        bill.billSoFar.push(singleItem)
        updateBillTotals(numberPeople);

        addToMyTotals(singleItem);

      }

      function updateBillTotals(numberPeople) {
        console.log('num', numberPeople)
        bill.runningTotal = calculateRunningTotal();
        bill.totalTip = calculateTip();
        bill.tipPerPerson = bill.totalTip / numberPeople;
        personalTotals.tip = bill.tipPerPerson;
        bill.totalTax = calculateTax();
        bill.grandTotal = calculateTotal();
        bill.remainder = calculateRemainder();
      }

      function calculateRunningTotal() {
        var runningTotal = 0;
          bill.billSoFar.forEach(function(item) {
            runningTotal += Number(item.price);
            runningTotal += Number(item.tax);
          })
      return runningTotal;
      }

      function calculateRemainder() {
        return bill.grandTotal - bill.runningTotal;
      }

      function calculateTip() {
        return bill.subtotal * bill.tipPercent / 100;
      }

      function calculateTax() {
        return bill.subtotal * bill.taxPercent / 100;
      }

      function calculateTotal() {
        return Number(bill.subtotal) + bill.totalTip + bill.totalTax;
      }

      function deleteItem(index, numberPeople) {
        var item = bill.billSoFar.splice(index, 1)[0]
        subtractFromMyTotals(item)
        updateBillTotals(numberPeople);
      }

      function updateTax() {
        var taxPercent = bill.taxPercent;
        bill.billSoFar.forEach(function(item) {
          item.tax = item.price * taxPercent / 100;
        });
      }

      function addToMyTotals(item) {
        personalTotals.food += item.price;
        personalTotals.tax += item.tax;
        personalTotals.tip = bill.tipPerPerson;
        personalTotals.total += item.price + item.tax;
        console.log(item)
      }

      function subtractFromMyTotals(item) {
        personalTotals.food -= item.price;
        personalTotals.tax -= item.tax;
        personalTotals.total -= (item.price + item.tax);
      }

      function calculateMyTotal(name, numberPeople) {
        var srvc = this;
        personalTotals = {
          food: 0,
          tax: 0,
          tip: 0,
          total: 0
        }
        bill.billSoFar.forEach(function(item) {
          if (item.user===name) {
            srvc.addToMyTotals(item);
          }
        });
        console.log(bill.tipPerPerson)
        console.log('num', numberPeople)
        personalTotals.tip = bill.tipPerPerson;
        return personalTotals;
      }

      function updateFromSocket(newBill) {
        bill.billSoFar = newBill.billSoFar;
        bill.taxPercent = newBill.taxPercent;
        bill.tipPercent = newBill.tipPercent;
        bill.runningTotal = newBill.runningTotal;
        bill.subtotal = newBill.subtotal;
        bill.remainder = newBill.remainder;
        bill.totalTip = newBill.totalTip;
        bill.tipPerPerson = newBill.tipPerPerson;
        bill.totalTax = newBill.totalTax;
        bill.grandTotal = newBill.grandTotal;
      }

    return {

      bill: bill,

      personalTotals: personalTotals,

      updateSubtotal: updateSubtotal,

      submit: submit,

      updateBillTotals: updateBillTotals,

      calculateRunningTotal: calculateRunningTotal,

      calculateRemainder: calculateRemainder,

      calculateTip: calculateTip,

      calculateTax: calculateTax,

      calculateTotal: calculateTotal,

      deleteItem: deleteItem,

      updateTax: updateTax,

      addToMyTotals: addToMyTotals,

      subtractFromMyTotals: subtractFromMyTotals,

      calculateMyTotal: calculateMyTotal,

      updateFromSocket: updateFromSocket
    };
  })
  .factory('splitcheckSockets', function(socket, splitcheckService) {
    
      function sendBillUpdate(roomNumber, newBill) {
        socket.socket.emit('updateBill', roomNumber, newBill)
      }
    
      function listen(ctrl) {
        socket.socket.on('updateBill', function(newBill) {
          splitcheckService.updateFromSocket(newBill);
          ctrl.bill = ctrl.updateMyPage();
        })

        socket.socket.on('updateMyBill', function(roomNumber) {
          var bill = splitcheckService.bill;
          sendBillUpdate(roomNumber, bill)
        })

        socket.socket.on('countPeople', function(numberPeople) {
          splitcheckService.updateBillTotals(numberPeople);
          ctrl.bill.tipPerPerson = splitcheckService.bill.tipPerPerson;
        })
      }

    return {
      sendBillUpdate: sendBillUpdate,
      listen: listen
    }
  });
