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

    var numberPeople = personCounterService.numberPeople;

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
      bill.billSoFar = updateTax(bill.billSoFar)
      bill.runningTotal = calculateRunningTotal();
      bill.totalTip = calculateTip();
      bill.tipPerPerson = bill.totalTip / numberPeople;
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
            // socket.socket.emit('updateRoom', roomId, {event: 'updateBill', doc: data})
        })
        .error(function(data){
            console.log("error");
        });
    }

    // function updateSubtotal(newSubtotal, newTip, newTax, numberPeople) {
    //     updateBillTotals(numberPeople);
    //   }

      function submit(singleItem, roomId) {
        var user = singleItem.user,
            food = singleItem.food,
            price = singleItem.price,
            tax = singleItem.tax;

        bill.billSoFar.push(singleItem)
        // updateBillTotals(numberPeople);

        // personalTotals = addToMyTotals(singleItem, personalTotals);
        bill = updateBill(bill, roomId)
      }

      function updateBillTotals(numberPeople) {
        
        personalTotals.tip = bill.tipPerPerson;
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

      function deleteItem(index, roomId) {
        var item = bill.billSoFar.splice(index, 1)[0];
        updateBill(bill, roomId);
        // personalTotals = subtractFromMyTotals(item, personalTotals)
        // updateBillTotals(numberPeople);
      }

      function updateTax(billSoFar) {
        var taxPercent = bill.taxPercent;
        billSoFar.forEach(function(item) {
          item.tax = item.price * taxPercent / 100;
        });
        return billSoFar;
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

      get:get,

      // updateSubtotal: updateSubtotal,

      submit: submit,

      updateBillTotals: updateBillTotals,

      updateBill: updateBill,

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

      updateFromSocket: updateFromSocket,

      postUpdatedBill: postUpdatedBill
    };
  })
  .factory('splitcheckSockets', function(socket, splitcheckService) {
    
      function sendBillUpdate(roomId, newBill) {
        // socket.socket.emit('updateRoom', roomId, {event: 'updateBill', newBill: newBill})
      }
    
      function listen(ctrl, roomId) {

        socket.socket.on('updateRoom', function(eventRoomId, data) {
          if (data.event==='updateBill') {
            if (eventRoomId === roomId) {
              console.log('socket data', data.bill)
              splitcheckService.updateFromSocket(data.bill);
              ctrl.bill = data.bill;
            }
          }
           if (data.event==='timeUp') {
              if (eventRoomId === roomId) {
                ctrl.timeUp = true;
              }
           }
        })

        socket.socket.on('updateRoomForMe', function(roomId, data) {
          // var bill = splitcheckService.bill;
          // sendBillUpdate(roomId, bill)
        })

        socket.socket.on('countPeople', function(numberPeople) {
          // splitcheckService.updateBillTotals(numberPeople);
          // ctrl.bill.tipPerPerson = splitcheckService.bill.tipPerPerson;
        })
      }

    return {
      sendBillUpdate: sendBillUpdate,
      listen: listen
    }
  });
