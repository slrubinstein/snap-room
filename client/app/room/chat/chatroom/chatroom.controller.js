'use strict';

angular.module('roomApp')
  .controller('ChatroomCtrl', function ($scope, $stateParams, socket, $http, $interval,
                                    chatroomService, Auth, $state, roomSocketsService, $window,
                                    personCounterService, geoRoomArrVal, usernameVal,
                                    roomCreationService) {

    var ctrl = this;

    this.params = $stateParams;
    var roomId = this.params.roomId;
    var geoRoomArr = geoRoomArrVal.geoRooms;
    ctrl.timeUp = false;

    //roomData, and roomColor are all assigned in
    //getRoomSuccessCallback
    this.roomData ={};
    this.roomColor;

    this.inputField = ''; //sets the input field to be empty initially

    //getRoom is called whenever a user enters a room. The method call
    //is just below the function definition. Its purpose is to make available
    //to the client any info that has already been posted in the room, the
    //amount of time left before the room expires, and the room color/type,
    //as well as to start the interval that runs the timer.
    this.getRoom = function(roomId) {
      var promise = chatroomService.get(roomId)
      .then(getRoomSuccessCallback, getRoomErrorCallback)
    };

    this.getRoom(roomId);

    function getRoomSuccessCallback(room) {
        ctrl.roomData = room;
    }

    function getRoomErrorCallback(error) {
      
    }

    
    //submitInput is called when the user submits the name of a restaurant
    //or a message. It calls chatroomService.submitInput with a number of
    //parameters that varies depending on whether the user is logged in
    this.submitInput = function() {
      var name = usernameVal.name;
      var picture = usernameVal.picture; 

      if (ctrl.inputField.length < 100) {
        chatroomService.submitInput(ctrl.inputField, roomId, name, picture);
        //to empty the input field:
        ctrl.inputField = '';
      }
    }

    // set up socket event listeners
    chatroomService.listen(roomId, $scope, ctrl, this.user);


  });

