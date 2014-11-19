'use strict';

angular.module('roomApp')
  .controller('RoomCtrl', function ($scope, $stateParams, socket, $http) {
    $scope.message = 'Hello';

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
        });
    }

    this.vote = function(choice) {
      $http.put("/api/room/" + this.params.data, 
        {choice : choice})
        .success(function(data){
            // console.log(data);
        });
    }
  });
