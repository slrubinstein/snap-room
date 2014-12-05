'use strict';

angular.module('roomApp')
  .controller('SplitcheckCtrl', function ($scope, Auth) {

  	var ctrl = this;

  	this.user = '';
  	this.item = '';
  	this.price = '';
  	this.tax = 8.875;

  	this.billItems = [{user: 'Steve', item: 'sandwich', price: 4, itemTax: 1}];

  	this.submit = function() {
  		var userBill = {
  			user: ctrl.user,
  			item: ctrl.item,
  			price: ctrl.price,
  			itemTax: ctrl.price * ctrl.tax/100
  		}

  		this.billItems.push(userBill);
  		ctrl.user = '';
  		ctrl.item = '';
  		ctrl.price = '';
  	}



  });
