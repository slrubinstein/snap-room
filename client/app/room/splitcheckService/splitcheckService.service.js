'use strict';

angular.module('roomApp')
  .factory('splitcheckService', function () {

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

        personalTotals = addToMyTotals(singleItem, personalTotals);

      }

      function updateBillTotals(numberPeople) {
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
        personalTotals = subtractFromMyTotals(item, personalTotals)
        updateBillTotals(numberPeople);
      }

      function updateTax() {
        var taxPercent = bill.taxPercent;
        bill.billSoFar.forEach(function(item) {
          item.tax = item.price * taxPercent / 100;
        });
      }

      function addToMyTotals(item, current) {
        current.food += item.price;
        current.tax += item.tax;
        current.tip = bill.tipPerPerson;
        current.total += item.price + item.tax + personalTotals.tip;
        return current;
      }

      function subtractFromMyTotals(item, current) {
        current.food -= item.price;
        current.tax -= item.tax;
        current.total -= (item.price + item.tax);
        return current;
      }

      function calculateMyTotal(name) {
        personalTotals = {
          food: 0,
          tax: 0,
          tip: 0,
          total: 0
        }
        personalTotals.tip = bill.tipPerPerson;
        bill.billSoFar.forEach(function(item) {
          if (item.user===name) {
            personalTotals = addToMyTotals(item, personalTotals);
          }
        });
        return personalTotals;
      }

      function updateFromSocket(newBill) {
        bill = newBill;

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
    
      function sendBillUpdate(roomId, newBill) {
        socket.socket.emit('updateRoom', roomId, {event: 'updateBill', newBill: newBill})
      }
    
      function listen(ctrl, roomId) {

        socket.socket.on('updateRoom', function(eventRoomId, data) {
          if (data.event==='updateBill') {
            if (eventRoomId === roomId) {
              splitcheckService.updateFromSocket(data.newBill);
              ctrl.bill = ctrl.updateMyPage();
            }
          }
           if (data.event==='timeUp') {
              if (eventRoomId === roomId) {
                ctrl.timeUp = true;
              }
           }
        })

        socket.socket.on('updateRoomForMe', function(roomId, data) {
          var bill = splitcheckService.bill;
          sendBillUpdate(roomId, bill)
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
