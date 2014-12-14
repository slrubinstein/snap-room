'use strict';

angular.module('roomApp')
  .factory('splitcheckService', function ($http, $location, personCounterService, socket) {

    var bill = {
        billSoFar: [],
        taxPercent: 8.875,
        tipPercent: 18,
        runningTotal: 0,
        subtotal: 0,
        remainder: 0,
        totalTip: 0,
        totalTax: 0,
        grandTotal: 0,
      };

    var personalTotals = {
        food: 0,
        tax: 0,
        tip: 0,
        total: 0
      };

    function get(roomId) {
      return $http.get("/api/splitcheckRoom/" + roomId)
        .then(function(data){
          bill = data.data.bill;
          return bill; 
        }, function(){
          $location.path("/");
        });
    }

    function updateBill(billData, roomId) {
      bill.subtotal = billData.subtotal;
      bill.tipPercent = billData.tipPercent;
      bill.taxPercent = billData.taxPercent;
      bill.billSoFar = updateTax(bill.billSoFar);
      bill.billSoFar = updateTip(bill.billSoFar);
      bill.runningTotal = calculateRunningTotal();
      bill.totalTip = calculateTip();
      bill.totalTax = calculateTax();
      bill.grandTotal = calculateTotal();
      bill.remainder = calculateRemainder();
      postUpdatedBill(bill, roomId);
      return bill;
    }

    function postUpdatedBill(bill, roomId) {
      $http.put("/api/splitcheckRoom/" + roomId, 
        {roomId: roomId, 
          bill : bill})
        .success(function(data){
      })
      .error(function(data){
          console.log("error");
      });
    }

      function submit(singleItem, roomId) {
        bill.billSoFar.push(singleItem);
        bill = updateBill(bill, roomId);
      }

      function calculateRunningTotal() {
        var runningTotal = 0;
          bill.billSoFar.forEach(function(item) {
            runningTotal += Number(item.price);
            runningTotal += Number(item.tax);
            runningTotal += Number(item.tip);
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

      function deleteItem(index, roomId) {
        bill.billSoFar.splice(index, 1)[0];
        updateBill(bill, roomId);
      }

      function updateTax(billSoFar) {
        var taxPercent = bill.taxPercent;
        billSoFar.forEach(function(item) {
          item.tax = item.price * taxPercent / 100;
        });
        return billSoFar;
      }

      function updateTip(billSoFar) {
        var tipPercent = bill.tipPercent;
          billSoFar.forEach(function(item) {
            item.tip = item.price * tipPercent / 100;
        });
        return billSoFar;
      }

      function addToMyTotals(item, current) {
        current.food += item.price;
        current.tax += item.tax;
        current.tip += item.tip;
        current.total += item.price + item.tax + item.tip;
        return current;
      }

      function subtractFromMyTotals(item, current) {
        current.food -= item.price;
        current.tax -= item.tax;
        current.tip -= item.tip;
        current.total -= (item.price + item.tax);
        return current;
      }

      function calculateMyTotal(selected) {
        personalTotals = {
          food: 0,
          tax: 0,
          tip: 0,
          total: 0
        }
        selected.forEach(function(item, index) {
          if (item===true) {
            personalTotals = addToMyTotals(bill.billSoFar[index], personalTotals);
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

      get:get,

      submit: submit,

      updateBill: updateBill,

      calculateRunningTotal: calculateRunningTotal,

      calculateRemainder: calculateRemainder,

      calculateTip: calculateTip,

      calculateTax: calculateTax,

      calculateTotal: calculateTotal,

      deleteItem: deleteItem,

      updateTax: updateTax,

      updateTip: updateTip,

      addToMyTotals: addToMyTotals,

      subtractFromMyTotals: subtractFromMyTotals,

      calculateMyTotal: calculateMyTotal,

      updateFromSocket: updateFromSocket,

      postUpdatedBill: postUpdatedBill
    };
  })
  .factory('splitcheckSockets', function(socket, splitcheckService) {
    
      function listen(ctrl, roomId) {

        socket.socket.on('updateRoom', function(eventRoomId, data) {
          if (data.event==='updateBill') {
            if (eventRoomId === roomId) {
              splitcheckService.updateFromSocket(data.bill);
              ctrl.bill = data.bill;
              ctrl.refreshArray()
            }
          }
           if (data.event==='timeUp') {
              if (eventRoomId === roomId) {
                ctrl.timeUp = true;
              }
           }
        })
      }

    return {
      listen: listen
    }
  });
