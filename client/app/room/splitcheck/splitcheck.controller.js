'use strict';

angular.module('roomApp')
  .controller('SplitcheckCtrl', function ($scope, Auth) {

  	var ctrl = this;

  	this.user = '';
  	this.item = '';
  	this.price = '';
  	this.tax = 8.875;
  	this.tipPercent = 18;

  	this.billItems = [{user: 'Steve', item: 'sandwich', price: 4, itemTax: 1}];

  	this.subtotal;

  	this.test = this.subtotal;
  	this.short = this.grandTotal - this.runningTotal;

  	// should update to divide by num of people in room?
  	this.tipFromEach = this.totalTip / this.billItems.length;


  	this.updateTotals = function() {
	  	ctrl.totalTip = ctrl.subtotal * ctrl.tipPercent/100;
  		ctrl.totalTax = ctrl.subtotal * ctrl.tax/100;
  		ctrl.grandTotal = +ctrl.subtotal + ctrl.totalTip + ctrl.totalTax;
  	}

  	this.submit = function() {
  		var userBill = {
  			user: ctrl.user,
  			item: ctrl.item,
  			price: Number(ctrl.price),
  			itemTax: ctrl.price * ctrl.tax/100
  		}

  		ctrl.billItems.push(userBill);
  		ctrl.runningTotal = ctrl.calculateRunningTotal(ctrl.billItems);
  		ctrl.user = '';
  		ctrl.item = '';
  		ctrl.price = '';
  	}

  	this.calculateRunningTotal = function(billItems) {
  		var runningTotal = 0;
  		ctrl.billItems.forEach(function(item) {
	  		runningTotal += item.price;
	  		runningTotal += item.itemTax;
	  	})
	  	return runningTotal;
	  }

  	console.log(this.calculateRunningTotal(ctrl.billItems))


  	this.runningTotal = this.calculateRunningTotal(this.billItems);

  });
