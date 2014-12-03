'use strict';

angular.module('roomApp')
  .controller('MainCtrl', function ($state, $scope, $http, 
          socket, $stateParams, $window, timerFactory, geolocation,
          populateRooms, Auth, $location, $cookieStore, User) {

    var ctrl = this;

    this.geoData;//if geoSuccessCallback is called, 
    //geoData will be assigned to an object containing
    //geolocation information
    this.geoRoom;//whenever a user accesses the site,
    //they are placed in a socket room based on their geolocation.
    //When rooms in their geo area are created or expire, they
    //will be updated. geoRoom is the name (a string) for that 
    //socket room
    this.availableRooms = [];//availableRooms is assigned in
    //getRoomsSuccessCallback

    this.roomColorsCount;//roomColorsCount is assigned and adjusted
    //in assignRoomColorAndNum(), and keeps track of how many red, 
    //green, and blue rooms are available in the client's geo area

    this.roomToCreateColor;//setRoomToCreateColor is the color of
    //the room that will be created if this user creates a room

    this.nameInput;

    this.user = {};
    this.isLoggedIn = false;

    // create menu functions
    this.menuOpen = false;
    this.fbook = false;
    this.openMenu = function() {
      ctrl.menuOpen = true;
    }

    this.timerOptions = ['1:00', '2:00', '5:00', '10:00']
    this.timerLength = '2:00'


    //getRoomByGeo is called just after the function definition.
    //It runs whenever a user navigates to the main page. Its
    //purpose is to show the user a list of available rooms near 
    //their geolocation, and join them to a socket geoRoom
    this.getRoomByGeo = function() {
      //get geolocation. getGeo is a promise
      var getGeo = geolocation.getLocation()
        .then(geoSuccessCallback, geoErrorCallback);
    };

    ctrl.getRoomByGeo();
        
    //geoSuccessCallback is called by getRoomByGeo when the 
    //geolocation.getLocation() method resolves the deferred that 
    //the geoGeo promise is associated with     
    function geoSuccessCallback (geoData) {
      ctrl.geoData = geoData; //geoData has three properties:
      //latitude, longitude, and geoLocated (a boolean)

      //geolocation.makeGeoRoom creates the name (a string) for
      //the geoRoom that this user will be added to, using
      //geoData.latitude and geoData.longitude
      ctrl.geoRoom = geolocation.makeGeoRoom(geoData)

      //this statement causes the user to join a geoRoom 
      socket.socket.emit("joinAnteroom", ctrl.geoRoom);

      //getRooms is a promise
      var getRooms = populateRooms.get(geoData)
        .then(getRoomsSuccessCallback, getRoomsErrorCallback);

    }

    //geoSuccessCallback is called by getRoomByGeo when the 
    //geolocation.getLocation() method rejects the deferred that 
    //the geoGeo promise is associated with   
    function geoErrorCallback() {

    }

    //getRoomsSuccessCallback is called by geoSuccessCallback 
    //when the populateRooms.get() method resolves the deferred 
    //that the getRooms promise is associated with  
    function getRoomsSuccessCallback(rooms) {
      ctrl.availableRooms = rooms;
      assignRoomColorAndNum(rooms);
    }


    //getRoomsErrorCallback is called by geoSuccessCallback 
    //when the populateRooms.get() method rejects the deferred 
    //that the getRooms promise is associated with  
    function getRoomsErrorCallback() {
      
    }

    //the refreshRoomList event is emitted by the server whenever
    //a room is created or expires. It is sent to the members of
    //the relevant geoRoom
    socket.socket.on('refreshRoomList', function() {
      var getRooms = populateRooms.get(ctrl.geoData)
        .then(function(rooms) {
          ctrl.availableRooms = rooms;
          assignRoomColorAndNum(rooms);
      })
    });

    //assignRoomColorAndNum assigns the color and, if there is
    //more than one room for a particular color, the number
    //for each room in this user's geo area
    function assignRoomColorAndNum(rooms) {
      ctrl.roomColorsCount = {"blue": 0, "green": 0, "red": 0};
      rooms.forEach(function(room){
        //increment the properties of roomColorsCount based on
        //the color of each room in this user's geo area
        ctrl.roomColorsCount[room.color] += 1;
        room.colorAndNum = room.color;
        //if there is more than one room for a particular color,
        //start naming rooms "red2" room, "green2" room, etc. 
        if (ctrl.roomColorsCount[room.color] > 1) {
          room.colorAndNum += ctrl.roomColorsCount[room.color];
        }
      });
      setRoomToCreateColor(0);
    }

    //setRoomToCreateColor is used to determine the color of the 
    //room that will be created if this user creates a room. It is
    //first called by assignRoomColorAndNum, with an argument of 0.
    //It will choose the first color that has only been assigned
    //num times (0 times when first called). If all three colors have
    //already been assigned once or more, the function will call itself
    //recursively, with num incremented by 1
    function setRoomToCreateColor(num) {
      for (var color in ctrl.roomColorsCount) {
        var colorCount = ctrl.roomColorsCount[color];
        if (colorCount === num) {
          ctrl.roomToCreateColor = color;
        }
      }
      if (ctrl.roomToCreateColor) return;
        setRoomToCreateColor(num + 1);
    }


    this.createRoom = function(color, type) {
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

    function setUser(validUser) {
       if (validUser) {
        ctrl.isLoggedIn = true;
        ctrl.user = User.get();
       }
    }

    Auth.isLoggedInAsync(setUser);



  });
