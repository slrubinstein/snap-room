'use strict';

angular.module('roomApp')
  .controller('SplitcheckCtrl', function ($scope, Auth, socket, $state,
                                          splitcheckService, splitcheckSockets,
                                          personCounterService) {

  	var ctrl = this;
  	var roomId = $state.params.roomId

    splitcheckService.roomId = roomId;



    this.deleteItem = deleteItem;
    this.food = '';
    this.numberPeople = personCounterService.numberPeople;
    this.price = '';
    this.submit = submit;
    this.timeUp = false;
    this.updateMyPage = updateMyPage;
    // this.updatePersonalTotal = updatePersonalTotal;
    this.updateSubtotal = updateSubtotal;
    this.user = '';

    this.calculateMyTotal = calculateMyTotal;

    getRoom(roomId);

    function getRoom(roomId) {
      var promise = splitcheckService.get(roomId)
      .then(function(bill) {
        ctrl.bill = bill;
        
     }, getRoomErrorCallback)
   }
    

    function getRoomErrorCallback(error) {
      console.log(error)
    }

    personCounterService.listen(this, $scope);


    // socket.socket.emit('updateRoomForMe', roomId, {event: 'updateMyBill'})

    // variables shared with everyone on bill
    // when any of these change, it should change for everyone via socket
    function updateMyPage() {
      var bill = splitcheckService.bill;
      return bill;
    }

    // set up socket listeners
    splitcheckSockets.listen(ctrl, roomId);

    // function updatePersonalTotal() {
    //   var personalTotal = {};
    //   personalTotal = splitcheckService.personalTotals;
    //   return personalTotal;
    // }


    // set initial values for personal total
    this.personalTotal = splitcheckService.personalTotals ;


  	function updateSubtotal() {
      ctrl.bill = splitcheckService.updateBill({subtotal: Number(ctrl.bill.subtotal),
                              tipPercent: ctrl.bill.tipPercent,
                              taxPercent: ctrl.bill.taxPercent}, roomId
                            )

      // splitcheckService.updateSubtotal(subtotal, tipPercent, taxPercent, ctrl.numberPeople);
      // ctrl.bill = ctrl.updateMyPage();
      // ctrl.personalTotal.tip = splitcheckService.personalTotals.tip;

      // splitcheckSockets.sendBillUpdate(roomId, ctrl.bill);
  	}

  	function submit() {
  		splitcheckService.submit({user: ctrl.user,
                            		food: ctrl.food,
                            		price: Number(ctrl.price),
                            		tax: ctrl.price * ctrl.bill.taxPercent/100,
                                tip: ctrl.price * ctrl.bill.tipPercent/100},
                                roomId
      )

      // ctrl.bill = ctrl.updateMyPage();
      ctrl.personalTotal = splitcheckService.personalTotals;

      // reset page inputs to empty
  		ctrl.food = '';
  		ctrl.price = '';
      // splitcheckSockets.sendBillUpdate(roomId, ctrl.bill);

  	}

    function calculateMyTotal() {
      ctrl.personalTotal = splitcheckService.calculateMyTotal(ctrl.user);
    }

	  function deleteItem(index) {

	  	splitcheckService.deleteItem(index, roomId, this.numberPeople);
    //   ctrl.personalTotal = updatePersonalTotal();
    //   ctrl.updateMyPage();
    //   splitcheckSockets.sendBillUpdate(roomId, ctrl.bill);
	  }

  });
