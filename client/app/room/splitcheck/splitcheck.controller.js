'use strict';

angular.module('roomApp')
  .controller('SplitcheckCtrl', function ($scope, Auth, socket, $state) {

  	// MUST ADD ROOM NUMBER

  	var ctrl = this;
  	var roomNumber = $state.params.roomNumber
  	socket.socket.emit('joinBillRoom', roomNumber)

  	this.user = '';
  	this.item = '';
  	this.price = '';
  	this.taxPercent = 8.875;
  	this.tipPercent = 18;

  	this.billItems = [];

  	this.personalTotal = {
  		food: 0,
  		tax: 0,
  		tip: 0,
  		myTotal: 0
  	}


  	this.subtotal;

  	this.remainder = this.grandTotal - this.runningTotal || 0;

  	// should update to divide by num of people in room?
  	this.tipFromEach = this.totalTip / this.billItems.length;


  	this.updateTotals = function() {
  		ctrl.runningTotal = ctrl.calculateRunningTotal(ctrl.billItems);
	  	ctrl.totalTip = ctrl.subtotal * ctrl.tipPercent/100;
  		ctrl.totalTax = ctrl.subtotal * ctrl.taxPercent/100;
  		ctrl.grandTotal = +ctrl.subtotal + ctrl.totalTip + ctrl.totalTax;
  		ctrl.remainder = ctrl.grandTotal - ctrl.runningTotal;
  		ctrl.tipFromEach = ctrl.totalTip / ctrl.billItems.length;
  		ctrl.personalTotal.tip = ctrl.tipFromEach;
  		socket.socket.emit('updateTotals', roomNumber, {subtotal: ctrl.subtotal,
						  																				tip: ctrl.totalTip,
						  																				tax: ctrl.totalTax,
						  																				total: ctrl.grandTotal,
						  																				taxPercent: ctrl.taxPercent,
						  																				runningTotal: ctrl.runningTotal,
						  																				remainder: ctrl.remainder,
						  																				tipFromEach: ctrl.tipFromEach}
  		);
  	}

  	this.submit = function() {
  		var userBill = {
  			user: ctrl.user,
  			item: ctrl.item,
  			price: Number(ctrl.price),
  			itemTax: ctrl.price * ctrl.taxPercent/100
  		}
  		ctrl.updateMyTotals({food: Number(ctrl.price),
  												 tax: Number(ctrl.price) * ctrl.taxPercent/100},
  												 'plus'
  		);

  		ctrl.billItems.push(userBill);
  		ctrl.runningTotal = ctrl.calculateRunningTotal(ctrl.billItems);
  		ctrl.remainder = ctrl.grandTotal - ctrl.runningTotal;
  		ctrl.item = '';
  		ctrl.price = '';
  		ctrl.tipFromEach = ctrl.totalTip / ctrl.billItems.length;
  		// ctrl.personalTotal.tip = ctrl.tipFromEach;
  		//socket call
  		ctrl.updateBillThroughSocket();

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

  	this.calculateRunningTotal = function(billItems) {
  		var runningTotal = 0;
  		ctrl.billItems.forEach(function(item) {
	  		runningTotal += item.price;
	  		runningTotal += item.itemTax;
	  	})
	  	return runningTotal;
	  }

	  this.deleteItem = function(index) {
	  	ctrl.billItems.splice(index, 1);
	  	ctrl.updateMyTotals
	  	socket.socket.emit('deleteItem', roomNumber, index);
	  }

	  this.updateTax = function() {
	  	ctrl.billItems.forEach(function(item) {
	  		item.itemTax = item.price * ctrl.taxPercent/100;
	  	});
	  	ctrl.updateTotals();
	  	ctrl.updateBillThroughSocket();
	  }

	  this.updateBillThroughSocket = function() {
	  	socket.socket.emit('updateBill', roomNumber, {billItems: ctrl.billItems, 
						  																			runningTotal: ctrl.runningTotal,
						  																			remainder: ctrl.remainder,
						  																			tipFromEach: ctrl.tipFromEach}
			);	
	  }


	  socket.socket.on('updateBill', function(data) {
	  	ctrl.billItems = data.billItems;
	  	ctrl.runningTotal = data.runningTotal;
	  	ctrl.remainder = data.remainder;
	  	ctrl.tipFromEach = data.tipFromEach;
	  	ctrl.personalTotal.tip = ctrl.tipFromEach;
	  })

	  socket.socket.on('updateMyBill', function() {
	  	ctrl.updateBillThroughSocket();
	  })

	  socket.socket.on('deleteItem', function(index) {
	  	ctrl.billItems.splice(index, 1);
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

  	this.runningTotal = this.calculateRunningTotal(this.billItems);

  });
