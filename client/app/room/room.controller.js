'use strict';

angular.module('roomApp')
  .controller('RoomCtrl', function ($scope, $stateParams, socket, $http, $interval,
                                    roomFactory, timerFactory, setColors) {

    $scope.message = 'Hello';
    var ctrl = this;

    this.params = $stateParams;
    var roomNumber = $stateParams.roomNumber;
    var geoRoom = $stateParams.geoRoom;

    $scope.roomData = [];
    //$scope.roomData = this.getRoom(roomNumber);

    this.restName = '';

    socket.syncUpdates('room', $scope.roomData, roomNumber);    

    $scope.initialRoomData;
    $scope.roomColor;

    console.log('params', $stateParams)


        this.colorScheme = setColors.set(this.params.color)


    this.runTimer = function(expiresAt) {
      $scope.timeNow = new Date().getTime();
      var minutesLeftDecimal = String(($scope.expiresAt.getTime() - $scope.timeNow) / 1000 / 60);
      $scope.minutesLeft = minutesLeftDecimal.substring(0, minutesLeftDecimal.indexOf("."));
      var rawSecondsLeft = String(minutesLeftDecimal.substring(minutesLeftDecimal.indexOf(".")) * 60);
      $scope.secondsLeft =  rawSecondsLeft.substring(0, rawSecondsLeft.indexOf("."));
      if (Number($scope.secondsLeft) < 10) $scope.secondsLeft = "0" + $scope.secondsLeft; 

      if(Number(minutesLeftDecimal) < 0) {
        $interval.cancel($scope.countDown);
        socket.socket.emit('timeUp', $scope.initialRoomData.roomNumber, geoRoom);
      }
    };

   this.returnArray = function(num) {
          var arr = []; 
          for (var i = 0; i < num; i++) {
            arr.push(i);
          }
          return arr;
    };

    this.getRoom = function(roomNumber) {
       var promise = roomFactory.get(roomNumber)
       .then(function(roomData) {
          $scope.initialRoomData = roomData.initialRoomData;
          $scope.roomColor = roomData.roomColor;
          $scope.expiresAt = roomData.expiresAt;
          $scope.countDown = $interval(ctrl.runTimer, 1000);
       })
    };

    this.getRoom(roomNumber);

    this.submitInput = function() {
      roomFactory.submitInput(roomNumber);
      ctrl.restName = '';
    }

    this.vote = function(choice, upOrDown, event, index) {
      
      if (upOrDown) {
        $(event.target).parent().parent().css("background-color", $scope.roomColor);
      }

      else {
        $(event.target).parent().addClass('animated fadeOutUp');
        ctrl.restaurants.splice(index,1);
      }  

      roomFactory.submitVote(roomNumber, choice, upOrDown);

    };

    this.restaurants = [];

    this.getFourSquare = function() {
      var promise = roomFactory.getFourSquare(roomNumber)
        .then(function(restaurants) {
          ctrl.restaurants = restaurants;
        });
    };

    socket.socket.on('timeUp', function(winner, maxVotes, expiredRoomNumber) {
      if (Number(expiredRoomNumber) === Number(roomNumber)) {
        ctrl.timeUp = true;
        ctrl.winner = winner;
        ctrl.maxVotes = maxVotes;
      }
    });
    socket.socket.emit('join', roomNumber);
    
    socket.socket.on('newPerson', function(numberPeople) {
      $scope.numberPeople = numberPeople;
      console.log(numberPeople);
      $scope.$apply();
    });


  });
