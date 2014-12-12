'use strict';

angular.module('roomApp')
  .controller('SplitcheckCtrl', function ($scope, Auth, socket, $state,
                                          splitcheckService, splitcheckSockets,
                                          personCounterService) {

  	var ctrl = this;
  	var roomId = $state.params.roomId

    this.timeUp = false;

    // display number of people in room
    this.numberPeople = personCounterService.numberPeople;
    personCounterService.listen(this, $scope);

    // updates bill for late joiners
  	socket.socket.emit('updateRoomForMe', roomId, {event: 'updateMyBill'})

    // variables shared with everyone on bill
    // when any of these change, it should change for everyone via socket
    ctrl.updateMyPage = function() {
      var bill = splitcheckService.bill;
      return bill;
    }

    // set up socket listeners
    splitcheckSockets.listen(ctrl, roomId);

    var updatePersonalTotal = function() {
      var personalTotal = {};
      personalTotal = splitcheckService.personalTotals;
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
      var subtotal = ctrl.bill.subtotal,
          tipPercent = ctrl.bill.tipPercent,
          taxPercent = ctrl.bill.taxPercent;

      splitcheckService.updateSubtotal(subtotal, tipPercent, taxPercent, ctrl.numberPeople);
      ctrl.bill = ctrl.updateMyPage();
      ctrl.personalTotal.tip = splitcheckService.personalTotals.tip;

      splitcheckSockets.sendBillUpdate(roomId, ctrl.bill);
  	}

  	this.submit = function() {
  		splitcheckService.submit({user: ctrl.user,
                            		food: ctrl.food,
                            		price: Number(ctrl.price),
                            		tax: ctrl.price * ctrl.bill.taxPercent/100},
                                ctrl.numberPeople
      )

      ctrl.bill = ctrl.updateMyPage();
      ctrl.personalTotal = updatePersonalTotal();

      // reset page inputs to empty
  		ctrl.food = '';
  		ctrl.price = '';
      splitcheckSockets.sendBillUpdate(roomId, ctrl.bill);

  	}

    this.calculateMyTotal = function() {
      ctrl.personalTotal = splitcheckService.calculateMyTotal(ctrl.user);
    }

	  this.deleteItem = function(index) {
	  	splitcheckService.deleteItem(index, ctrl.numberPeople);
      ctrl.personalTotal = updatePersonalTotal();
      ctrl.updateMyPage();
      splitcheckSockets.sendBillUpdate(roomId, ctrl.bill);
	  }

  });
