'use strict';

angular.module('roomApp')
  .controller('RoomCtrl', function ($scope, $stateParams, socket, $http, $interval,
                                    timerFactory, setColors) {
    $scope.message = 'Hello';
    var ctrl = this;

    this.params = $stateParams;
    var roomNumber = $stateParams.roomNumber;

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
        socket.socket.emit('timeUp', $scope.initialRoomData.roomNumber);
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
       $http.get("/api/room/" + roomNumber)
         .success(function(data){
          $scope.initialRoomData = data;
          $scope.roomColor = data.color;
          $scope.expiresAt = new Date(Date.parse(data.ourExpTime));
          $scope.countDown = $interval(ctrl.runTimer, 1000); 
        console.log(ctrl.colorScheme.trimColor)
       }).error(function(data){
           ctrl.message = "error";
       });
    };

    this.getRoom(roomNumber);

    this.submitInput = function() {
      $http.put("/api/room/" + this.params.roomNumber, 
      	{choice : chatForm.textInput.value})
        .success(function(data){
            // console.log(data);
            ctrl.restName = '';
        })
        .error(function(data){
            console.log("error");
        });
    }

    this.vote = function(choice, upOrDown, event, index) {

      if (upOrDown) {
        $(event.target).parent().parent().css("background-color", $scope.roomColor);
      }

      else {
        $(event.target).parent().addClass('animated fadeOutUp');
        ctrl.restaurants.splice(index,1);
      }  

      $http.put("/api/room/" + roomNumber, 
        {choice : choice,
          upOrDown: upOrDown})
        .success(function(data){
        })
        .error(function(data){
            console.log("error");
        });
    };

    this.restaurants = [];

    this.getFourSquare = function() {
        $http.get('/api/room/' + roomNumber + '/vendor/foursquare')
            .success(function(data) {
              console.log(data)
                var restaurants = data.response.groups[0].items;
                ctrl.restaurants = restaurants;
            }) 
    }

    socket.socket.on('timeUp', function(winner, maxVotes) {
      ctrl.timeUp = true;
      ctrl.winner = winner;
      ctrl.maxVotes = maxVotes;
    });
    socket.socket.emit('join', roomNumber);
    
    socket.socket.on('newPerson', function(numberPeople) {
      $scope.numberPeople = numberPeople;
      console.log(numberPeople);
      $scope.$apply();
    });


  });
