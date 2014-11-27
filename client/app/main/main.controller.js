'use strict';

angular.module('roomApp')
  .controller('MainCtrl', function ($state, $scope, $http, 
          socket, $stateParams, $window, timerFactory, geolocation,
          populateRooms) {
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
    this.geoData;

    this.getRoomByGeo = function() {
      // get geolocation
      var getGeo = geolocation.getLocation()
        .then(function(geoData) {
          ctrl.geoData = geoData;
          // use geolocation to find available rooms
          var getRooms = populateRooms.get(geoData)
            .then(function(rooms) {
              ctrl.availableRooms = rooms;
              // run assign colors
              ctrl.assignColors(rooms);
            })
        })
    }

    this.assignColors = function(rooms) {
      rooms.forEach(function(room){
        ctrl.assignedColors[room.color] += 1;
        room.colorAndNum = room.color;
        if (ctrl.assignedColors[room.color] > 1) {
          room.colorAndNum += ctrl.assignedColors[room.color];
        }
      });
      ctrl.setRoomToCreateColor(0);
    }


    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    this.createRoom = function (color) {
      $http.post("/api/room", {lat: ctrl.geoData.lat, 
                               lon: ctrl.geoData.lon, 
                               color: color})
        .success(function(data){
          $state.go("room", {'roomNumber': data.roomNumber});
          socket.socket.emit('createRoom', data.roomNumber, color)
          //timerFactory.timerListener();
        })
        .error(function(data){
          console.log("error creating room");
        }); 
    };

    this.enterRoom = function(roomNumber) {
      if (roomNumber) {
         populateRooms.enter(roomNumber);
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

    // this.getRoomByGeo = function() {
    //   navigator.geolocation.getCurrentPosition(function(position) {
    //     ctrl.geoLocated = true;
    //     ctrl.lat = position.coords.latitude;
    //     ctrl.lon = position.coords.longitude;
    //     ////////
    //     $http.get("/api/room/" + ctrl.lat.toFixed(1) + "/" + ctrl.lon.toFixed(1))
    //      .success(function(data){
    //         ctrl.availableRooms = data;
    //         //$state.go("room", {'data': data});
    //         ctrl.availableRooms.forEach(function(room){
    //           ctrl.assignedColors[room.color] += 1;
    //           room.colorAndNum = room.color;
    //           if (ctrl.assignedColors[room.color] > 1) {
    //             room.colorAndNum += ctrl.assignedColors[room.color];
    //           }
    //         });
    //         ctrl.setRoomToCreateColor(0);

    //    }).error(function(data){
    //        ctrl.message = "room doesn't exist";
    //    });
    //   }); 
    // };

    
    this.getRoomByGeo();
    
    socket.socket.on('refreshRoomList', function() {
      console.log("hello");
      ctrl.getRoomByGeo();
    });

  });
