'use strict';

angular.module('roomApp')
  .controller('MainCtrl', function ($state, $scope, $http, socket, $stateParams) {
    $scope.awesomeThings = [];

    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    //   socket.syncUpdates('thing', $scope.awesomeThings);
    // });
////////////////////////////////////
    
    this.message;
    var ctrl = this;
    this.availableRooms = [];
    this.lat;
    this.lon;
    this.geoLocated = false;

    this.createRoom = function (color) {
      $http.post("/api/room", {lat: ctrl.lat, 
                               lon: ctrl.lon, 
                               color: color})
        .success(function(room){
          $state.go("room", {'data': room});
          socket.socket.emit('create', room, color);
        })
        .error(function(data){
          console.log("error creating room");
        }); 
    };

    this.getRoom = function(roomNumber) {
      if (roomNumber) {
         $http.get("/api/room/" + roomNumber)
           .success(function(data){
             $state.go("room", {'data': roomNumber});
             socket.socket.emit('join', roomNumber);

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

    this.assignedColors = {"blue": 0, "green": 0, "red": 0};
    this.roomToCreateColor;

    this.setRoomToCreateColor = function(num) {
      for (var color in this.assignedColors) {
        var colorCount = this.assignedColors[color];
        if (colorCount === num) {
          ctrl.roomToCreateColor = color;
        }
      }
      if (ctrl.roomToCreateColor) return;
      this.setRoomToCreateColor(num + 1);
    };

    this.getRoomByGeo = function() {

      navigator.geolocation.getCurrentPosition(function(position) {
        ctrl.geoLocated = true;
        ctrl.lat = position.coords.latitude.toFixed(1);
        ctrl.lon = position.coords.longitude.toFixed(1);
        $http.get("/api/room/" + ctrl.lat + "/" + ctrl.lon)
         .success(function(data){
            ctrl.availableRooms = data;
            //$state.go("room", {'data': data});
            ctrl.availableRooms.forEach(function(room){
              ctrl.assignedColors[room.color] += 1;
              room.colorAndNum = room.color;
              if (ctrl.assignedColors[room.color] > 1) {
                room.colorAndNum += ctrl.assignedColors[room.color];
                console.log(room.color);
                console.log(room.colorAndNum);
              }
            });
            ctrl.setRoomToCreateColor(0);

       }).error(function(data){
           ctrl.message = "room doesn't exist";
       });
      }); 
    };


    socket.socket.on('welcome', function(data) {
      console.log('You have created a room', data.msg);
    })

    // when new room is created, run getRoomByGeo to
    // populate landing page with new rooms
    socket.socket.on('newRoomCreated', function() {
      ctrl.getRoomByGeo();
    })
    
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
