'use strict';

angular.module('roomApp')
  .controller('MainCtrl', function ($state, $scope, $http, 
          socket, $stateParams, $window, timerFactory, geolocation,
          populateRooms, Auth, $location, $cookieStore, User) {

    var ctrl = this;

    this.availableRooms = [];
    

    this.roomToCreateColor;
    this.nameInput;

    this.user = {};
    this.isLoggedIn = false;
    Auth.isLoggedInAsync(setUser);

        // create menu functions
    this.menuOpen = false;
    this.fbook = false;
    this.openMenu = function() {
      ctrl.menuOpen = true;
    }

    this.timerOptions = ['1:00', '2:00', '5:00', '10:00']
    this.timerLength = '2:00'


    this.lat;
    this.lon;
    this.geoLocated = false;
    this.geoData;
    this.geoRoom;


    getRoomByGeo();

    function getRoomByGeo() {
      // get geolocation. getGeo is a promise
      var getGeo = geolocation.getLocation()
        .then(geoSuccessCallback, geoErrorCallback);
    }
        
    function geoSuccessCallback(geoData) {
      ctrl.geoData = geoData;
      ctrl.geoRoom = geolocation.makeGeoRoom(geoData)
      // use geolocation to find available rooms
      socket.socket.emit("joinAnteroom", ctrl.geoRoom);
      var getRooms = populateRooms.get(geoData)
        .then(function(rooms) {
          ctrl.availableRooms = rooms;
          // run assign colors
          ctrl.assignColors(rooms);
        })
    }

    function geoErrorCallback(error) {
      console.log(error);
    }


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
      var roomName = ctrl.nameInput || null;
      var timerLength = ctrl.timerLength;
      populateRooms.create({lat: ctrl.geoData.lat,
                            lon: ctrl.geoData.lon, 
                            color: color, 
                            geoRoom: ctrl.geoRoom,
                            type: type,
                            lock: lock,
                            roomName: roomName,
                            timerLength: timerLength});
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

    

    
    socket.socket.on('refreshRoomList', function() {
      var getRooms = populateRooms.get(ctrl.geoData)
        .then(function(rooms) {
          ctrl.availableRooms = rooms;
          // run assign colors
          ctrl.assignColors(rooms);
        })
    });

    

    
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



  });
