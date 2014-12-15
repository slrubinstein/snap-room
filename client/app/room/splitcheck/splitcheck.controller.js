'use strict';

angular.module('roomApp')
  .controller('SplitcheckCtrl', function ($scope, Auth, socket, $state,
                                          splitcheckService, splitcheckSockets,
                                          personCounterService) {

  	var ctrl = this;
  	var roomId = $state.params.roomId

    splitcheckService.roomId = roomId;

    ctrl.calculateMyTotal = calculateMyTotal;
    ctrl.deleteItem = deleteItem;
    ctrl.food = '';
    ctrl.numberPeople = personCounterService.numberPeople;
    ctrl.personalTotal = splitcheckService.personalTotals ;
    ctrl.price = '';
    ctrl.refreshArray = refreshArray;
    ctrl.selected = [];
    ctrl.submit = submit;
    ctrl.timeUp = false;
    ctrl.updateSubtotal = updateSubtotal;
    ctrl.user = '';

    getRoom(roomId);

    personCounterService.listen(ctrl, $scope);

    splitcheckSockets.listen(ctrl, roomId);

    function getRoom(roomId) {
      var promise = splitcheckService.get(roomId)
      .then(function(bill) {
        ctrl.bill = bill;
     }, getRoomErrorCallback)
   }
    

    function getRoomErrorCallback(error) {
      console.log(error)
    }

  	function updateSubtotal() {
      ctrl.bill = splitcheckService.updateBill({subtotal: Number(ctrl.bill.subtotal),
                              tipPercent: ctrl.bill.tipPercent,
                              taxPercent: ctrl.bill.taxPercent}, roomId)
  	}

  	function submit() {
  		splitcheckService.submit({user: ctrl.user,
                            		food: ctrl.food,
                            		price: Number(ctrl.price),
                            		tax: ctrl.price * ctrl.bill.taxPercent/100,
                                tip: ctrl.price * ctrl.bill.tipPercent/100},
                                roomId)
  		ctrl.food = '';
  		ctrl.price = '';

  	}

    function calculateMyTotal() {
      ctrl.personalTotal = splitcheckService.calculateMyTotal(ctrl.selected);
    }

	  function deleteItem(index) {
      ctrl.selected.splice(index, 1)
	  	splitcheckService.deleteItem(index, roomId);
      ctrl.personalTotal = splitcheckService.calculateMyTotal(ctrl.selected);
	  }

    function refreshArray() {
      ctrl.selected.length = ctrl.bill.billSoFar.length
      $scope.$apply()
      calculateMyTotal();
    }

  });
