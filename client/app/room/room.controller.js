'use strict';

angular.module('roomApp')
  .controller('RoomCtrl', function ($scope, $stateParams, socket, $http) {
    $scope.message = 'Hello';
    var self = this;

    this.params = $stateParams;
    var roomNumber = $stateParams;

    console.log("room# ", roomNumber)

    $scope.roomData = [];
    socket.syncUpdates('room', $scope.roomData, roomNumber.data);

    this.submitInput = function() {
      $http.put("/api/room/" + this.params.data, 
      	{choice : chatForm.textInput.value})
        .success(function(data){
            // console.log(data);
        })
        .error(function(data){
            console.log("error");
        });
    }

    this.vote = function(choice) {
      $http.put("/api/room/" + this.params.data, 
        {choice : choice})
        .success(function(data){
            // console.log(data);
        })
        .error(function(data){
            console.log("error");
        });
    }

    this.load = function() {
        this.restaurants.push('dig inn', 'tres carnes', 'chipotle', 'chopt')
    }

    this.restaurants = [];

    this.getFourSquare = function() {
      navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        $http.post('/api/room/' + roomNumber.data + '/foursquare', {
                                                            lat: lat,
                                                            lon: lon
                                                          })
            .success(function(data) {
                console.log('returned data', data)
                var restaurants = data.response.groups[0].items;
                self.restaurants = restaurants;
            })

        
      })
    }
  });
