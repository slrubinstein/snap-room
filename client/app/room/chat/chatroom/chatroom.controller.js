'use strict';

angular.module('roomApp')
  .controller('ChatroomCtrl', function ($stateParams, socket, 
                                        chatroomService, geoRoomArrVal,
                                        usernameVal) {

    var ctrl = this;

    this.params = $stateParams;
    var roomId = this.params.roomId;
    var geoRoomArr = geoRoomArrVal.geoRooms;

    this.timeUp = false; //this is assigned to true when the socket
    //listener in chatroomService receives an updateRoom event
    //with data.event === 'timeUp', and causes the view to change

    this.roomData ={};//roomData is assigned in getRoomSuccessCallback,
    //and also when the socket listener in chatroomService receives an
    //updateRoom event with data.event === 'chat'

    this.errorUpdatingRoomData = false; //assigned to true when
    //getRoomErrorCallback is called, and causes a message to
    //be shown to the user
    ctrl.errorSubmittingMessage = false; //assigned to true when
    //submitErrorCb is called, and causes a message to
    //be shown to the user

    this.inputField = ''; //sets the input field to be empty initially

    //getRoom is called whenever a user enters a room. The method call
    //is just below the function definition. Its purpose is to make 
    //available to the client any info specific to this type of room
    this.getRoom = function(roomId) {
      chatroomService.get(roomId)
       .then(getRoomSuccessCallback, getRoomErrorCallback)
    };

    this.getRoom(roomId);

    function getRoomSuccessCallback(room) {
      ctrl.roomData = room;
    }

    function getRoomErrorCallback(error) {
      ctrl.errorUpdatingRoomData = true;
    }

    // set up socket event listeners
    chatroomService.listen(roomId, ctrl, this.user);
    
    //submitInput is called when the user submits a message. It calls 
    //chatroomService.submitInput with a number of parameters that varies 
    //depending on whether the user is logged in
    this.submitInput = function() {
      var name = usernameVal.name;
      var picture = usernameVal.picture; 

      if (ctrl.inputField.length < 100) {
        chatroomService.submitInput(ctrl.inputField, roomId, name, picture)
         .then(submitSuccessCb, submitErrorCb);
        //to empty the input field:
        ctrl.inputField = '';
      }
    }

    function submitSuccessCb(data) {
      socket.socket.emit('updateRoom', roomId, {event: 'chat', doc: data});
    }

    function submitErrorCb() {
      ctrl.errorSubmittingMessage = true;
    }

  });

