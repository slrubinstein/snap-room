'use strict';

angular.module('roomApp')
  .controller('RoomCtrl', function ($scope, $stateParams, socket, $http, $interval,
                                    roomService, Auth, $state, roomCreationService,
                                    fourSquareService, roomSocketsService, $window,
                                    personCounterService, geoRoomArrVal, usernameVal) {





    var ctrl = this;

    this.params = $stateParams;
    var roomId = this.params.roomId;
    var geoRoomArr = geoRoomArrVal.geoRooms;
    // this.roomType = roomCreationService.roomType;
    this.roomColor = this.params.color;

    //roomData, roomType, and roomColor are all assigned in
    //getRoomSuccessCallback
    this.roomName = '';

    // display number of people in room
    this.numberPeople = personCounterService.numberPeople;
    this.namesOfPeople = personCounterService.namesOfPeople;
    personCounterService.listen(this, $scope);

    this.inputField = ''; //sets the input field to be empty initially

    // getRoom is called whenever a user enters a room. The method call
    // is just below the function definition. Its purpose is to make available
    // to the client any info that has already been posted in the room, the
    // amount of time left before the room expires, and the room color/type,
    // as well as to start the interval that runs the timer.
    this.getRoom = function(roomId) {
       var promise = roomService.get(roomId)
       .then(getRoomSuccessCallback, getRoomErrorCallback)
     };

     this.getRoom(roomId);

    function getRoomSuccessCallback(room) {
        ctrl.roomName = room.roomName;
        ctrl.expiresAt = new Date(Date.parse(room.ourExpTime));
        ctrl.countDown = $interval(ctrl.runTimer, 1000);

        if (ctrl.roomColor === "red") {
           $("body").css("background-color", "#D46A6A" );
        }
        else if (ctrl.roomColor === "green") {
           $("body").css("background-color","#87FC81" );
        }
        else if (ctrl.roomColor === "blue") {
           $("body").css("background-color", "#8DADF9" );
        }
    }

    function getRoomErrorCallback(error) {
      
    }

    this.runTimer = function(expiresAt) {
      $scope.timeNow = new Date().getTime();
      var minutesLeftDecimal = String((ctrl.expiresAt.getTime() - $scope.timeNow) / 1000 / 60);
      $scope.minutesLeft = minutesLeftDecimal.substring(0, minutesLeftDecimal.indexOf("."));
      var rawSecondsLeft = String(minutesLeftDecimal.substring(minutesLeftDecimal.indexOf(".")) * 60);
      $scope.secondsLeft =  rawSecondsLeft.substring(0, rawSecondsLeft.indexOf("."));
      if (Number($scope.secondsLeft) < 10) $scope.secondsLeft = "0" + $scope.secondsLeft; 

      if(Number(minutesLeftDecimal) < 0.01) {
        $interval.cancel(ctrl.countDown);
        socket.socket.emit('timeUp', roomId, geoRoomArr);
      }
    };
    
    //facebook login stuff
    this.user = Auth.getCurrentUser();
    this.isLoggedIn = Auth.isLoggedIn();

    // set up socket event listeners
    roomSocketsService.listen(roomId, $scope, ctrl, this.user);


    this.backToMain = function() {
      $state.go("main");
    }

    this.showUsers = false;

    this.toggleUsers = function() {
      ctrl.showUsers = !ctrl.showUsers;
    }


  });
