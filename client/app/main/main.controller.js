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
    this.availableRooms = [];

    this.createRoom = function () {
      navigator.geolocation.getCurrentPosition(function(position) {
         var lat = position.coords.latitude;
         var lon = position.coords.longitude;
         $http.post("/api/room", {lat: lat.toFixed(3), lon: lon.toFixed(3)})
         .success(function(data){
             $state.go("room", {'data': data});
         })
         .error(function(data){
            console.log("error creating room");
          }); 
      });
    };

    this.getRoom = function(roomNumber) {
      console.log(roomNumber);
      if (roomNumber) {
         $http.get("/api/room/" + roomNumber)
           .success(function(data){
             $state.go("room", {'data': roomNumber});

         }).error(function(data){
             ctrl.message = "room doesn't exist";
         });
      }
      else {
         $http.get("/api/room/" + roomIdForm.idInput.value)
           .success(function(data){
             $state.go("room", {'data': roomIdForm.idInput.value});

         }).error(function(data){
             ctrl.message = "room doesn't exist";
         });
      }
    };

    this.getRoomByGeo = function() {

      navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        $http.get("/api/room/" + lat.toFixed(3) + "/" + lon.toFixed(3))
         .success(function(data){
            console.log(data);
            ctrl.availableRooms = data;
            //$state.go("room", {'data': data});

       }).error(function(data){
           ctrl.message = "room doesn't exist";
       });
      }); 
    };

      this.getRoomByGeo();   
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
