'use strict';

angular.module('roomApp')
  .controller('RoomCtrl', function ($scope, $stateParams, socket, $http) {
    $scope.message = 'Hello';

    this.params = $stateParams;

    $scope.roomData = [];
    socket.syncUpdates('room', $scope.roomData);

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
