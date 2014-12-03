'use strict';

angular.module('roomApp')
  .controller('RoomCtrl', function ($scope, $stateParams, socket, $http, $interval,
                                    roomFactory, timerFactory, Auth, $state,
                                    fourSquareService, roomSocketsService) {


    var ctrl = this;

    this.params = $stateParams;
    var roomNumber = $stateParams.roomNumber;
    var geoRoom = $stateParams.geoRoom;

    this.roomData;
    this.roomType;
    this.roomColor;

    this.restName = '';

    this.backToMain = function() {
      $state.go("main");
    }

    this.showUsers = function() {

    }


    this.runTimer = function(expiresAt) {
      $scope.timeNow = new Date().getTime();
      var minutesLeftDecimal = String((ctrl.expiresAt.getTime() - $scope.timeNow) / 1000 / 60);
      $scope.minutesLeft = minutesLeftDecimal.substring(0, minutesLeftDecimal.indexOf("."));
      var rawSecondsLeft = String(minutesLeftDecimal.substring(minutesLeftDecimal.indexOf(".")) * 60);
      $scope.secondsLeft =  rawSecondsLeft.substring(0, rawSecondsLeft.indexOf("."));
      if (Number($scope.secondsLeft) < 10) $scope.secondsLeft = "0" + $scope.secondsLeft; 

      if(Number(minutesLeftDecimal) < 0) {
        $interval.cancel(ctrl.countDown);
        socket.socket.emit('timeUp', ctrl.roomData.roomNumber, geoRoom);
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
       .then(function(room) {
          ctrl.roomData = room;
          ctrl.roomColor = room.color;
          ctrl.roomType = room.type
          ctrl.expiresAt = new Date(Date.parse(room.ourExpTime));
          ctrl.countDown = $interval(ctrl.runTimer, 1000);
          console.log(ctrl.roomData)
       })
    };

    this.getRoom(roomNumber);

    this.submitInput = function() {
      var type = ctrl.roomType;
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
        roomFactory.toggleColors(ctrl.roomColor, event)
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


    // fourSquare API call, hide, and show functions
    this.getFourSquare = function() {
      var promise = fourSquareService.get(roomNumber)
        .then(function(restaurants) {
          ctrl.restaurants = restaurants;
        });
    };

    this.showFoursquare = function() {
      fourSquareService.show(event);
    }

    this.hideFoursquare = function() {
      fourSquareService.hide(event);
    }

    this.seeVotes = function(event) {
      $(event.target).closest('.list-group-item').next().toggleClass('ng-hide')
    }

    // set up socket event listeners
    roomSocketsService.listen(roomNumber, $scope, ctrl);


    //facebook login stuff
    this.user = Auth.getCurrentUser();
    this.isLoggedIn = Auth.isLoggedIn();




  });
