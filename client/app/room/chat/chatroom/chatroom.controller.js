'use strict';

angular.module('roomApp')
  .controller('ChatroomCtrl', function ($scope, $stateParams, socket, $http, $interval,
                                    chatroomService, Auth, $state, roomSocketsService, $window,
                                    personCounterService, geoRoomArrVal, usernameVal,
                                    roomCreationService) {

    var ctrl = this;

    this.params = $stateParams;
    var roomNumber = this.params.roomNumber;
    var geoRoomArr = geoRoomArrVal.geoRooms;
    ctrl.timeUp = false;

    //roomData, and roomColor are all assigned in
    //getRoomSuccessCallback
    this.roomData ={};
    this.roomColor;

    // display number of people in room
    // this.numberPeople = personCounterService.numberPeople;
    // this.namesOfPeople = personCounterService.namesOfPeople;
    // personCounterService.listen(this, $scope);

    this.inputField = ''; //sets the input field to be empty initially

    //getRoom is called whenever a user enters a room. The method call
    //is just below the function definition. Its purpose is to make available
    //to the client any info that has already been posted in the room, the
    //amount of time left before the room expires, and the room color/type,
    //as well as to start the interval that runs the timer.
    this.getRoom = function(roomNumber) {
      var promise = chatroomService.get(roomNumber)
      .then(getRoomSuccessCallback, getRoomErrorCallback)
    };

    this.getRoom(roomNumber);

    function getRoomSuccessCallback(room) {
        ctrl.roomData = room;
        // ctrl.roomColor = room.color;
        // ctrl.expiresAt = new Date(Date.parse(room.ourExpTime));
        // ctrl.countDown = $interval(ctrl.runTimer, 1000);

        // if (ctrl.roomColor === "red") {
        //    $("body").css("background-color", "#D46A6A" );
        // }
        // else if (ctrl.roomColor === "green") {
        //    $("body").css("background-color","#87FC81" );
        // }
        // else if (ctrl.roomColor === "blue") {
        //    $("body").css("background-color", "#8DADF9" );
        // }
    }

    function getRoomErrorCallback(error) {
      
    }

    // this.runTimer = function(expiresAt) {
    //   $scope.timeNow = new Date().getTime();
    //   var minutesLeftDecimal = String((ctrl.expiresAt.getTime() - $scope.timeNow) / 1000 / 60);
    //   $scope.minutesLeft = minutesLeftDecimal.substring(0, minutesLeftDecimal.indexOf("."));
    //   var rawSecondsLeft = String(minutesLeftDecimal.substring(minutesLeftDecimal.indexOf(".")) * 60);
    //   $scope.secondsLeft =  rawSecondsLeft.substring(0, rawSecondsLeft.indexOf("."));
    //   if (Number($scope.secondsLeft) < 10) $scope.secondsLeft = "0" + $scope.secondsLeft; 

    //   if(Number(minutesLeftDecimal) < 0.01) {
    //     $interval.cancel(ctrl.countDown);
    //     socket.socket.emit('timeUp', ctrl.roomData.roomNumber, geoRoomArr);
    //   }
    // };
    
    //submitInput is called when the user submits the name of a restaurant
    //or a message. It calls chatroomService.submitInput with a number of
    //parameters that varies depending on whether the user is logged in
    this.submitInput = function() {
      var name = usernameVal.name;
      var picture = usernameVal.picture; 
      // if (ctrl.user) {
      //   if (ctrl.user.facebook) {
      //     //name = ctrl.user.facebook.first_name;
      //     picture = ctrl.user.facebook.picture;
      //   }
      // }
      console.log(name, picture)
      if (ctrl.inputField.length < 100) {
        chatroomService.submitInput(ctrl.inputField, roomNumber, name, picture);
        //to empty the input field:
        ctrl.inputField = '';
      }
    }


    // facebook login stuff
    // this.user = Auth.getCurrentUser();
    // this.isLoggedIn = Auth.isLoggedIn();

    // set up socket event listeners
    chatroomService.listen(roomNumber, $scope, ctrl, this.user);

    // socket.socket.on('timeUp', function(expiredRoomNumber, data) {
    //   //in case the user is in multiple rooms (which is not supposed to happen)
    //   if (Number(expiredRoomNumber) === Number(roomNumber)) {
    //     ctrl.timeUp = true
    //     ////////////////////////////////////
    //     if (ctrl.roomType === 'lunch') {
    //       ctrl.winner = data.winner;
    //       ctrl.maxVotes = data.maxVotes;
    //     }
    //     ////////////////////////////////////
    //   }
    // });


  });

