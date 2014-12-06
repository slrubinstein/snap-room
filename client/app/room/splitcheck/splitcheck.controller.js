'use strict';

angular.module('roomApp')
  .controller('SplitcheckCtrl', function ($scope, Auth, socket, $state,
                                          splitcheckService, splitcheckSockets) {

  	var ctrl = this;
  	var roomNumber = $state.params.roomNumber

    // REDUNDANT
    this.roomNumber = roomNumber;

  	socket.socket.emit('joinBillRoom', roomNumber)

    // set up socket listeners

    // variables shared with everyone on bill
    // when any of these change, it should change for everyone via socket

    ctrl.updateMyPage = function() {
      var bill = {};
      
      bill.billSoFar = splitcheckService.bill.billSoFar;
      bill.taxPercent = splitcheckService.bill.taxPercent;
      bill.tipPercent = splitcheckService.bill.tipPercent;
      bill.runningTotal = splitcheckService.bill.runningTotal;
      bill.subtotal = splitcheckService.bill.subtotal;
      bill.remainder = splitcheckService.bill.remainder;
      bill.totalTip = splitcheckService.bill.totalTip;
      bill.myTip = splitcheckService.bill.tipPerPerson;
      bill.totalTax = splitcheckService.bill.totalTax;
      bill.grandTotal = splitcheckService.bill.grandTotal;

      return bill;
      }
    splitcheckSockets.listen(ctrl);

    var updatePersonalTotal = function() {
      var personalTotal = {};
      
      personalTotal.food = 0,
      personalTotal.tax = 0,
      personalTotal.tip = 0,
      personalTotal.myTotal = 0

      return personalTotal;
    }

    // set initial values
    this.bill = ctrl.updateMyPage();

    // user inputs for single bill item
  	this.user = '';
  	this.food = '';
  	this.price = '';

    // set initial values for personal total
    this.personalTotal = updatePersonalTotal();


  	this.updateSubtotal = function() {

      splitcheckService.updateSubtotal(ctrl.bill.subtotal);
      ctrl.bill = ctrl.updateMyPage();

      splitcheckSockets.sendBillUpdate(roomNumber, ctrl.bill);
  	}

  	this.submit = function() {
  		splitcheckService.submit({user: ctrl.user,
                            		food: ctrl.food,
                            		price: Number(ctrl.price),
                            		tax: ctrl.price * ctrl.bill.taxPercent/100}
      )

      ctrl.bill = ctrl.updateMyPage();
  		// ctrl.updateMyTotals({food: Number(ctrl.price),
  		// 										 tax: Number(ctrl.price) * ctrl.taxPercent/100},
  		// 										 'plus'
  		// );

  		ctrl.food = '';
  		ctrl.price = '';
      splitcheckSockets.sendBillUpdate(roomNumber, ctrl.bill);

  	}

  	// this.updateMyTotals = function(totals, plusOrMinus) {
  	// 	if (plusOrMinus === 'plus') {
	  // 		ctrl.personalTotal.food += totals.food;
	  // 		ctrl.personalTotal.tax += totals.tax;
	  // 		ctrl.personalTotal.myTotal = ctrl.personalTotal.food +
	  // 																 ctrl.personalTotal.tax +
	  // 																 ctrl.personalTotal.tip;
	  // 	} else {

	  // 	}
  	// }

  	this.calculateMyTotal = function() {
  		var myFood = 0, 
  				myTax = 0, 
  				myTip = 0;
  		ctrl.billItems.forEach(function(item) {
  			if(item.user === ctrl.user) {
  				myFood += item.price;
  				myTax += item.itemTax;
  			}
  		});
  		ctrl.personalTotal.food = myFood;
  		ctrl.personalTotal.tax = myTax;
  		ctrl.personalTotal.tip = ctrl.tipFromEach;
  		ctrl.updateMyTotals({food: 0, tax: 0}, 'plus')
  	}

  	// this.calculateRunningTotal = function(billSoFar) {
  	// 	var runningTotal = 0;
  	// 	ctrl.billSoFar.forEach(function(item) {
	  // 		runningTotal += item.price;
	  // 		runningTotal += item.itemTax;
	  // 	})
	  // 	return runningTotal;
	  // }

	  this.deleteItem = function(index) {
	  	splitcheckService.deleteItem(index);
      ctrl.updateMyPage();
      // ctrl.billSoFar.splice(index, 1);
	  	// ctrl.updateMyTotals
	  	// socket.socket.emit('deleteItem', roomNumber, index);
	  }

	  this.updateTax = function() {
	  	ctrl.billSoFar.forEach(function(item) {
	  		item.itemTax = item.price * ctrl.taxPercent/100;
	  	});
	  	ctrl.updateTotals();
	  	ctrl.updateBillThroughSocket();
	  }

	  // this.updateBillThroughSocket = function() {
	  // 	socket.socket.emit('updateBill', roomNumber, {billSoFar: ctrl.billSoFar, 
			// 			  																			runningTotal: ctrl.runningTotal,
			// 			  																			remainder: ctrl.remainder,
			// 			  																			tipFromEach: ctrl.tipFromEach}
			// );	
	  // }





	  // socket.socket.on('updateBill', function(data) {
	  // 	ctrl.billSoFar = data.billSoFar;
	  // 	ctrl.runningTotal = data.runningTotal;
	  // 	ctrl.remainder = data.remainder;
	  // 	ctrl.tipFromEach = data.tipFromEach;
	  // 	ctrl.personalTotal.tip = ctrl.tipFromEach;
	  // })

	  // socket.socket.on('updateMyBill', function() {
	  // 	ctrl.updateBillThroughSocket();
	  // })

	  // socket.socket.on('deleteItem', function(index) {
	  // 	ctrl.billSoFar.splice(index, 1);
	  // 	ctrl.updateTotals();
	  // })

	  // socket.socket.on('updateTotals', function(totals) {
	  // 	ctrl.subtotal = totals.subtotal;
	  // 	ctrl.totalTip = totals.tip;
	  // 	ctrl.totalTax = totals.tax;
	  // 	ctrl.grandTotal = totals.total;
	  // 	ctrl.taxPercent = totals.taxPercent;
	  // 	ctrl.runningTotal = totals.runningTotal;
	  // 	ctrl.remainder = totals.remainder;
	  // 	ctrl.tipFromEach = totals.tipFromEach;
	  // })

  	// this.runningTotal = this.calculateRunningTotal(this.billSoFar);

  });
