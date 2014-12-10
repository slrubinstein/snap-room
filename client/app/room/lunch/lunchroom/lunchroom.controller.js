'use strict';

angular.module('roomApp')
  .controller('LunchroomCtrl', function ($scope, $stateParams, socket, $http, 
  	                    $interval, lunchRoomService, Auth, $state,
                         fourSquareService, roomSocketsService, $window,
                         personCounterService, geoRoomArrVal, usernameVal) {


    var ctrl = this;

    this.params = $stateParams;
    var roomNumber = this.params.roomNumber;
    var geoRoomArr = geoRoomArrVal.geoRooms;
    this.roomType = this.params.type;

    //roomData, roomType, and roomColor are all assigned in
    //getRoomSuccessCallback
    this.roomData;
    this.roomColor;

    // display number of people in room
    this.numberPeople = personCounterService.numberPeople;
    this.namesOfPeople = personCounterService.namesOfPeople;
    personCounterService.listen(this, $scope);


    this.restaurants = []; //assigned to the array of restaurants
    //returned by getFourSquare, if getFourSquare is called

    this.inputField = ''; //sets the input field to be empty initially

    //getRoom is called whenever a user enters a room. The method call
    //is just below the function definition. Its purpose is to make available
    //to the client any info that has already been posted in the room, the
    //amount of time left before the room expires, and the room color/type,
    //as well as to start the interval that runs the timer.
    this.getRoom = function(roomNumber) {
      var promise = lunchRoomService.get(roomNumber, ctrl.roomType)
      .then(getRoomSuccessCallback, getRoomErrorCallback)
    };

    this.getRoom(roomNumber);

    function getRoomSuccessCallback(room) {
        ctrl.roomData = room;
        ctrl.roomColor = room.color;
        ctrl.roomType = room.type
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
        socket.socket.emit('timeUp', ctrl.roomData.roomNumber, geoRoomArr);
      }
    };
    
    //submitInput is called when the user submits the name of a restaurant
    //or a message. It calls lunchRoomService.submitInput with a number of
    //parameters that varies depending on whether the user is logged in
    this.submitInput = function() {
      var type = ctrl.roomType;
      var name = usernameVal.name;
      var picture = 'https://pbs.twimg.com/profile_images/413202074466131968/ZeuqFOYQ_normal.jpeg'; 
      // if (ctrl.user) {
      //   if (ctrl.user.facebook) {
      //     name = ctrl.user.facebook.first_name;
      //     picture = ctrl.user.facebook.picture;
      //   }
      // }
 
      if (ctrl.inputField.length < 100) {
        lunchRoomService.submitInput(roomNumber, name, picture, type);
        //to empty the input field:
        ctrl.inputField = '';
      }
  
    }

    //vote is called either by up/downvoting an already-selected
    //restaurant, or selecting a restaurant from the foursquare list
    this.vote = function(choice, upOrDown, event, index) {
      //if called by up/downvoting
      if (upOrDown) {
        lunchRoomService.toggleColors(ctrl.roomColor, event)
      }

      else {
        $(event.target).parent().addClass('animated fadeOutUp');
        ctrl.restaurants.splice(index,1);
      } 

      var name = usernameVal.name;
      //if the user is logged in 
      // if (ctrl.user) {
      //   if (ctrl.user.facebook) {
      //     name = ctrl.user.facebook.first_name;
      //   }
      // }
      lunchRoomService.submitVote(roomNumber, choice, upOrDown, name);

    };


    this.seeVotes = function(event) {
      $(event.target).closest('.list-group-item').next().toggleClass('ng-hide')
    }

///////////////////////////////////////////////////////////////
// fourSquare API call, hide, and show functions
    this.getFourSquare = function() {
      var promise = fourSquareService.get(roomNumber)
        .then(function(restaurants) {
          ctrl.restaurants = restaurants;
        },
        function(error) {
        });
    };

    this.showFoursquare = function() {
      fourSquareService.show(event);
    }

    this.hideFoursquare = function() {
      fourSquareService.hide(event);
    }

////////////////////////////////////////////////////////////////


    //facebook login stuff
    this.user = Auth.getCurrentUser();
    this.isLoggedIn = Auth.isLoggedIn();

    // set up socket event listeners
    roomSocketsService.listen(roomNumber, $scope, ctrl, this.user);


    this.backToMain = function() {
      $state.go("main");
    }

    //returnArray is used to display the correct number of dollar signs
    //for the list of restaurants from foursquare
    this.returnArray = function(num) {
          var arr = []; 
          for (var i = 0; i < num; i++) {
            arr.push(i);
          }
          return arr;
    };

    this.showUsers = false;

    this.toggleUsers = function() {
      ctrl.showUsers = !ctrl.showUsers;
    }




  });
