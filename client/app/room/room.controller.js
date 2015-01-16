'use strict';

angular.module('roomApp')
  .controller('RoomCtrl', function ($scope, $stateParams, socket, $http, $interval,
                                    roomService, Auth, $state, roomSocketsService, 
                                    personCounterService, geoRoomArrVal) {


    var ctrl = this;

    this.params = $stateParams;
    var roomId = this.params.roomId;
    this.roomColor = this.params.color;

    var geoRoomArr = geoRoomArrVal.geoRooms;

    this.inputField = ''; //sets the input field to be empty initially

    this.roomName = ''; //assigned in getRoomSuccessCallback

    this.showUsers = false; //toggled by this.toggleUsers. When true,
    //an overlay is displayed with the names of the users in the room

    this.showTimerError = false; //set to false in getRoomErrorCallback,
    //causes error message to be shown to the user

    //getRoom is called whenever a user enters a room. The method call
    //is just below the function definition. Its purpose is to make available
    //to the client the name of the room (if the user created one) and the
    //amount of time left before the room expires, as well as to start the 
    //interval that runs the timer.
    this.getRoom = function(roomId) {
       roomService.get(roomId)
        .then(getRoomSuccessCallback, getRoomErrorCallback)
     };

     this.getRoom(roomId);

    function getRoomSuccessCallback(roomState) {
        var room = roomState.data;
        ctrl.roomName = room.roomName;
        ctrl.expiresAt = new Date(Date.parse(room.ourExpTime));
        ctrl.countDown = $interval(ctrl.runTimer, 1000);
    }

    function getRoomErrorCallback(error) {
        ctrl.showTimerError = true;
    }

    //timer variables
    var timeNow,
        minutesLeftDecimal,
        rawSecondsLeft;
    this.minutesLeft;
    this.secondsLeft;

    this.runTimer = function(expiresAt) {
      timeNow = new Date().getTime();
      minutesLeftDecimal = String((ctrl.expiresAt.getTime() - timeNow) / 1000 / 60);
      ctrl.minutesLeft = minutesLeftDecimal.substring(0, minutesLeftDecimal.indexOf("."));
      rawSecondsLeft = String(minutesLeftDecimal.substring(minutesLeftDecimal.indexOf(".")) * 60);
      ctrl.secondsLeft =  rawSecondsLeft.substring(0, rawSecondsLeft.indexOf("."));
      if (Number(ctrl.secondsLeft) < 10) {ctrl.secondsLeft = "0" + ctrl.secondsLeft}; 

      if(Number(minutesLeftDecimal) < 0.01) {
        $interval.cancel(ctrl.countDown);
        socket.socket.emit('timeUp', roomId);
      }
    };
    
    //facebook login stuff
    this.user = Auth.getCurrentUser();
    this.isLoggedIn = Auth.isLoggedIn();

    //to instantiate listener for countPeople socket event, 
    //which sends data for namesOfPeople and numberOfPeople
    personCounterService.listen(ctrl);

    // set up socket event listeners
    roomSocketsService.listen(roomId, ctrl);
    
    this.numberOfPeople = personCounterService.numberOfPeople;
    this.namesOfPeople = personCounterService.namesOfPeople;


    this.backToMain = function() {
      $state.go("main");
    }

    this.toggleUsers = function() {
      ctrl.showUsers = !ctrl.showUsers;
    }
    
    //this is to ensure that the entire screen has the
    //appropriate background color
    roomService.setBackgroundColor(this.roomColor);




  });
