'use strict';

angular.module('roomApp')
  .controller('MainCtrl', function ($state, $scope, $http, 
          socket, $stateParams, $window, timerFactory, geolocation,
          populateRooms, Auth, $location, $cookieStore, User) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    
    this.message;
    var ctrl = this;
    this.availableRooms = [];
    this.lat;
    this.lon;
    this.geoLocated = false;
    this.geoData;
    this.geoRoom;

    this.getRoomByGeo = function() {
      // get geolocation
      var getGeo = geolocation.getLocation()
        .then(function(geoData) {
          ctrl.geoData = geoData;
          var latString = String(geoData.lat);
          var lonString = String(geoData.lon);
          var firstThreeLatNumbers;
          var firstThreeLonNumbers;
          if (latString[0] === "-") {
            firstThreeLatNumbers = latString.slice(1,3) + latString.slice(4,5);
          }
          else {
            firstThreeLatNumbers = latString.slice(0,2) + latString.slice(3,4);
          }
          if (lonString[0] === "-") {
            firstThreeLonNumbers = lonString.slice(1,3) + lonString.slice(4,5);
          }
          else {
            firstThreeLonNumbers = lonString.slice(0,2) + lonString.slice(3,4);
          }
          ctrl.geoRoom = "geoRoom" + firstThreeLatNumbers + firstThreeLonNumbers; 
          // use geolocation to find available rooms
          socket.socket.emit("joinAnteroom", ctrl.geoRoom);
          var getRooms = populateRooms.get(geoData)
            .then(function(rooms) {
              ctrl.availableRooms = rooms;
              // run assign colors
              ctrl.assignColors(rooms);
            })
        })
    }

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

    this.assignColors = function(rooms) {
      ctrl.assignedColors = {"blue": 0, "green": 0, "red": 0};
      rooms.forEach(function(room){
        ctrl.assignedColors[room.color] += 1;
        room.colorAndNum = room.color;
        if (ctrl.assignedColors[room.color] > 1) {
          room.colorAndNum += ctrl.assignedColors[room.color];
        }
      });
      ctrl.setRoomToCreateColor(0);
    }

    this.createRoom = function (color, type) {
      var lock = ctrl.fbook ? 'facebook': null;
      populateRooms.create({lat: ctrl.geoData.lat,
                            lon: ctrl.geoData.lon, 
                            color: color, 
                            geoRoom: ctrl.geoRoom,
                            type: type,
                            lock: lock});
    };

    this.enterRoom = function(roomNumber, color) {
      if (roomNumber) {
        populateRooms.enter({roomNumber: roomNumber, 
                             color: color, 
                             geoRoom: ctrl.geoRoom, 
                             isLoggedIn: Auth.isLoggedIn(), 
                             geoData: ctrl.geoData});
      }
    };

    
    this.getRoomByGeo();
    
    socket.socket.on('refreshRoomList', function() {
      console.log("refreshRoomList");
      var getRooms = populateRooms.get(ctrl.geoData)
        .then(function(rooms) {
          ctrl.availableRooms = rooms;
          // run assign colors
          ctrl.assignColors(rooms);
        })
    });

    
    this.user = {};
    this.isLoggedIn = false;
    Auth.isLoggedInAsync(setUser);
    
    function setUser(validUser) {
       if (validUser) {
        ctrl.isLoggedIn = true;
        ctrl.user = User.get();
       } 
    };



    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
      ctrl.user = Auth.getCurrentUser();
      ctrl.isLoggedIn = Auth.isLoggedIn();
    };

    $scope.logout = function() {
      Auth.logout();
      ctrl.user = Auth.getCurrentUser();
      ctrl.isLoggedIn = Auth.isLoggedIn();
      $location.path('/');
    }

    this.createFacebookRoom = function (color) {
      populateRooms.create({lat: ctrl.geoData.lat,
                            lon: ctrl.geoData.lon, 
                            color: color, 
                            geoRoom: ctrl.geoRoom,
                            lock: 'facebook'});
    };


    // create menu functions
    this.menuOpen = false;
    this.fbook = false;
    this.openMenu = function() {
      ctrl.menuOpen = true;
    }










  });
