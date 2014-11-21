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
    this.lat;
    this.lon;
    this.geoLocated = false;

    this.createRoom = function (color) {
      $http.post("/api/room", {lat: ctrl.lat, lon: ctrl.lon, color: color})
        .success(function(data){
          $state.go("room", {'data': data});
        })
        .error(function(data){
          console.log("error creating room");
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

    this.possibleColors = {"blue":true,"green":true,"red":true,"yellow":true};
    this.roomToCreateColor;

    this.getRoomByGeo = function() {

      navigator.geolocation.getCurrentPosition(function(position) {
        ctrl.geoLocated = true;
        ctrl.lat = position.coords.latitude.toFixed(1);
        ctrl.lon = position.coords.longitude.toFixed(1);
        $http.get("/api/room/" + ctrl.lat + "/" + ctrl.lon)
         .success(function(data){
            console.log(data);
            ctrl.availableRooms = data;
            //$state.go("room", {'data': data});
            ctrl.availableRooms.forEach(function(room){
               if (ctrl.possibleColors[room.color]) {
                  ctrl.possibleColors[room.color] = false;
               }
            });
            angular.forEach(ctrl.possibleColors, function(value, color){
               if (value) {
                    ctrl.roomToCreateColor = color;
               }
            });
            console.log(ctrl.roomToCreateColor);

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
