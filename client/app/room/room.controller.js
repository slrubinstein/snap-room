'use strict';

angular.module('roomApp')
  .controller('RoomCtrl', function ($scope, $stateParams, socket, $http, $interval,
                                    roomFactory, timerFactory, Auth) {

    $scope.message = 'Hello';
    var ctrl = this;

    this.params = $stateParams;
    var roomNumber = $stateParams.roomNumber;
    var geoRoom = $stateParams.geoRoom;

    $scope.roomData;
    $scope.roomType;

    this.restName = '';

    $scope.roomColor;

//    this.colorScheme = setColors.set(this.params.color)



    this.runTimer = function(expiresAt) {
      $scope.timeNow = new Date().getTime();
      var minutesLeftDecimal = String(($scope.expiresAt.getTime() - $scope.timeNow) / 1000 / 60);
      $scope.minutesLeft = minutesLeftDecimal.substring(0, minutesLeftDecimal.indexOf("."));
      var rawSecondsLeft = String(minutesLeftDecimal.substring(minutesLeftDecimal.indexOf(".")) * 60);
      $scope.secondsLeft =  rawSecondsLeft.substring(0, rawSecondsLeft.indexOf("."));
      if (Number($scope.secondsLeft) < 10) $scope.secondsLeft = "0" + $scope.secondsLeft; 

      if(Number(minutesLeftDecimal) < 0) {
        $interval.cancel($scope.countDown);
        socket.socket.emit('timeUp', $scope.roomData.roomNumber, geoRoom);
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
          $scope.roomData = roomData.initialRoomData;
          $scope.roomColor = roomData.roomColor;
          $scope.expiresAt = roomData.expiresAt;
          $scope.countDown = $interval(ctrl.runTimer, 1000);
          $scope.lockedRoom = roomData.lockedRoom;
          $scope.roomType = roomData.type;
          $scope.roomName = roomData.roomName;
       })
    };

    this.getRoom(roomNumber);

    this.submitInput = function() {
      var type = $scope.roomType;
      var name, picture; 
      if (ctrl.user) {
        if (ctrl.user.facebook) {
          name = ctrl.user.facebook.first_name;
          picture = ctrl.user.facebook.picture; 
        }
      }
      roomFactory.submitInput(roomNumber, name, picture, type);
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

      var name; 
      if (ctrl.user) {
        if (ctrl.user.facebook) {
          name = ctrl.user.facebook.first_name;
        }
      }
      roomFactory.submitVote(roomNumber, choice, upOrDown, name);

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

    socket.socket.on('timeUpChat', function(expiredRoomNumber) {
      if (Number(expiredRoomNumber) === Number(roomNumber)) {
        ctrl.timeUp = true;
      }
    });

    socket.socket.emit('join', roomNumber);
    
    socket.socket.on('newPerson', function(numberPeople) {
      $scope.numberPeople = numberPeople;
      $scope.$apply();
    });

    socket.socket.on('updateVotes', function(roomData) {
      $scope.roomData = roomData;
      $scope.$apply();
    });

    //facebook login stuff
    this.user = Auth.getCurrentUser();
    this.isLoggedIn = Auth.isLoggedIn();

    // console.log('user first name', ctrl.user.facebook.first_name)



  });
