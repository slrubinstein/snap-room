'use strict';

angular.module('roomApp')
  .controller('SplitcheckCtrl', function ($scope, Auth, socket, $state,
                                          splitcheckService) {

  	var ctrl = this;
  	var roomNumber = $state.params.roomNumber

  	socket.socket.emit('joinBillRoom', roomNumber)

    // variables shared with everyone on bill
    // when any of these change, it should change for everyone via socket

    var updateMyPage = function() {
      ctrl.billSoFar = splitcheckService.billSoFar;
      ctrl.taxPercent = splitcheckService.taxPercent;
      ctrl.tipPercent = splitcheckService.tipPercent;
      ctrl.runningTotal = splitcheckService.runningTotal;
      ctrl.subtotal = splitcheckService.subtotal;
      ctrl.remainder = splitcheckService.remainder;
      ctrl.totalTip = splitcheckService.totalTip;
      ctrl.myTip = splitcheckService.tipPerPerson;
      ctrl.totalTax = splitcheckService.totalTax;
      ctrl.grandTotal = splitcheckService.grandTotal;
    }
    // this.billItems = [];

    updateMyPage();
    // user inputs for single bill item
  	this.user = '';
  	this.food = '';
  	this.price = '';


  	this.personalTotal = {
  		food: 0,
  		tax: 0,
  		tip: 0,
  		myTotal: 0
  	}


  	this.subtotal;

  	this.remainder = this.grandTotal - this.runningTotal || 0;

  	// should update to divide by num of people in room?
  	// this.tipFromEach = this.totalTip / this.billItems.length;


  	this.updateSubtotal = function() {

      splitcheckService.updateSubtotal(ctrl.subtotal);
      updateMyPage();



  		// ctrl.runningTotal = ctrl.calculateRunningTotal(ctrl.billItems);
	  	// ctrl.totalTip = ctrl.subtotal * ctrl.tipPercent/100;
  		// ctrl.totalTax = ctrl.subtotal * ctrl.taxPercent/100;
  		// ctrl.grandTotal = +ctrl.subtotal + ctrl.totalTip + ctrl.totalTax;
  		// ctrl.remainder = ctrl.grandTotal - ctrl.runningTotal;
  		// ctrl.tipFromEach = ctrl.totalTip / ctrl.billItems.length;
  		// ctrl.personalTotal.tip = ctrl.tipFromEach;
  		// socket.socket.emit('updateTotals', roomNumber, {subtotal: ctrl.subtotal,
				// 		  																				tip: ctrl.totalTip,
				// 		  																				tax: ctrl.totalTax,
				// 		  																				total: ctrl.grandTotal,
				// 		  																				taxPercent: ctrl.taxPercent,
				// 		  																				runningTotal: ctrl.runningTotal,
				// 		  																				remainder: ctrl.remainder,
				// 		  																				tipFromEach: ctrl.tipFromEach}
  		// );
  	}

  	this.submit = function() {
  		splitcheckService.submit({user: ctrl.user,
                            		food: ctrl.food,
                            		price: Number(ctrl.price),
                            		tax: ctrl.price * ctrl.taxPercent/100}
      )

      updateMyPage();
  		// ctrl.updateMyTotals({food: Number(ctrl.price),
  		// 										 tax: Number(ctrl.price) * ctrl.taxPercent/100},
  		// 										 'plus'
  		// );

  		ctrl.food = '';
  		ctrl.price = '';


  	}

  	this.updateMyTotals = function(totals, plusOrMinus) {
  		if (plusOrMinus === 'plus') {
	  		ctrl.personalTotal.food += totals.food;
	  		ctrl.personalTotal.tax += totals.tax;
	  		ctrl.personalTotal.myTotal = ctrl.personalTotal.food +
	  																 ctrl.personalTotal.tax +
	  																 ctrl.personalTotal.tip;
	  	} else {

	  	}
  	}

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

  	this.calculateRunningTotal = function(billSoFar) {
  		var runningTotal = 0;
  		ctrl.billSoFar.forEach(function(item) {
	  		runningTotal += item.price;
	  		runningTotal += item.itemTax;
	  	})
	  	return runningTotal;
	  }

	  this.deleteItem = function(index) {
	  	splitcheckService.deleteItem(index);
      updateMyPage();
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

	  this.updateBillThroughSocket = function() {
	  	socket.socket.emit('updateBill', roomNumber, {billSoFar: ctrl.billSoFar, 
						  																			runningTotal: ctrl.runningTotal,
						  																			remainder: ctrl.remainder,
						  																			tipFromEach: ctrl.tipFromEach}
			);	
	  }


	  socket.socket.on('updateBill', function(data) {
	  	ctrl.billSoFar = data.billSoFar;
	  	ctrl.runningTotal = data.runningTotal;
	  	ctrl.remainder = data.remainder;
	  	ctrl.tipFromEach = data.tipFromEach;
	  	ctrl.personalTotal.tip = ctrl.tipFromEach;
	  })

	  socket.socket.on('updateMyBill', function() {
	  	ctrl.updateBillThroughSocket();
	  })

	  socket.socket.on('deleteItem', function(index) {
	  	ctrl.billSoFar.splice(index, 1);
	  	ctrl.updateTotals();
	  })

	  socket.socket.on('updateTotals', function(totals) {
	  	ctrl.subtotal = totals.subtotal;
	  	ctrl.totalTip = totals.tip;
	  	ctrl.totalTax = totals.tax;
	  	ctrl.grandTotal = totals.total;
	  	ctrl.taxPercent = totals.taxPercent;
	  	ctrl.runningTotal = totals.runningTotal;
	  	ctrl.remainder = totals.remainder;
	  	ctrl.tipFromEach = totals.tipFromEach;
	  })

  	this.runningTotal = this.calculateRunningTotal(this.billSoFar);

  });
