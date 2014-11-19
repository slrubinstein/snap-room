'use strict';

angular.module('roomApp')
  .controller('MainCtrl', function ($state, $scope, $http, socket, $stateParams) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });
////////////////////////////////////
    
    this.message;
    var ctrl = this;

    this.createRoom = function () {
       $http.post("/api/room").success(function(data){
           $state.go("room", {'data': data});
       }); 
    };

    this.getRoom = function() {
      console.log("main.getRoom");
       $http.get("/api/room/" + roomIdForm.idInput.value)
         .success(function(data){
           if (data === "OK"){
             $state.go("room", {'data': roomIdForm.idInput.value});
           }
           else {
             ctrl.message = "room doesn't exist";
           }
       });
    };   
/////////////////////////////////////////////       



    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
