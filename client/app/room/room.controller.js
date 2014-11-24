'use strict';

angular.module('roomApp')
  .controller('RoomCtrl', function ($scope, $stateParams, socket, $http, $interval,
                                    timerFactory) {
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

    this.getRoom = function(roomNumber) {
         $http.get("/api/room/" + roomNumber)
           .success(function(data){
            $scope.initialRoomData = data;
            $scope.roomColor = data.color;
             
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

    this.vote = function(choice, upOrDown, index, event) {
      if (event) {
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
    }

    this.restaurants = [];

    this.getFourSquare = function() {
        $http.get('/api/room/' + roomNumber + '/vendor/foursquare')
            .success(function(data) {
                console.log('returned data', data)
                var restaurants = data.response.groups[0].items;
                ctrl.restaurants = restaurants;
            }) 
    }


    this.timer = timerFactory.timer;


    socket.socket.on('decrementTimer', function(timer) {
      console.log('timer: ', timer)
      ctrl.timer = timer;
    });

  });
