'use strict';

angular.module('roomApp')
  .controller('SplitcheckCtrl', function ($scope, Auth, socket) {

  	// MUST ADD ROOM NUMBER
  	socket.socket.emit('joinBillRoom')
  	var ctrl = this;

  	this.user = '';
  	this.item = '';
  	this.price = '';
  	this.taxPercent = 8.875;
  	this.tipPercent = 18;

  	this.billItems = [];

  	this.subtotal;

  	this.test = this.subtotal;
  	this.remainder = this.grandTotal - this.runningTotal;

  	// should update to divide by num of people in room?
  	this.tipFromEach = this.totalTip / this.billItems.length;


  	this.updateTotals = function() {
	  	ctrl.totalTip = ctrl.subtotal * ctrl.tipPercent/100;
  		ctrl.totalTax = ctrl.subtotal * ctrl.taxPercent/100;
  		ctrl.grandTotal = +ctrl.subtotal + ctrl.totalTip + ctrl.totalTax;
  		ctrl.remainder = ctrl.grandTotal - ctrl.runningTotal;
  		socket.socket.emit('updateTotals', {subtotal: ctrl.subtotal,
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

  		ctrl.billItems.push(userBill);
  		ctrl.runningTotal = ctrl.calculateRunningTotal(ctrl.billItems);
  		ctrl.remainder = ctrl.grandTotal - ctrl.runningTotal;
  		ctrl.user = '';
  		ctrl.item = '';
  		ctrl.price = '';
  		ctrl.tipFromEach = ctrl.totalTip / ctrl.billItems.length;

  		//socket call
  		ctrl.updateBillThroughSocket();
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
	  	socket.socket.emit('deleteItem', index);
	  }

	  this.updateTax = function() {
	  	ctrl.billItems.forEach(function(item) {
	  		item.itemTax = item.price * ctrl.taxPercent/100;
	  	});
	  	ctrl.updateTotals();
	  	ctrl.updateBillThroughSocket();
	  }

	  this.updateBillThroughSocket = function() {
	  	socket.socket.emit('updateBill', {billItems: ctrl.billItems, 
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
