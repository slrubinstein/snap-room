'use strict';

angular.module('roomApp')
  // geoRoomArrVal is used to make the geoRooms arary available to all controllers
  .value('geoRoomArrVal', {geoRooms:[]})
  // usernameVal makes username accessible to all controllers
  .value('usernameVal', {name: ''})
  .controller('MainCtrl', function ($scope, $http, socket,
          $window, geolocationService, roomCreationService, Auth, $state, 
          User, geoRoomArrVal, nameGeneratorService, usernameVal) {

    var ctrl = this;

    this.geoData;//if geoSuccessCallback is called, 
    //geoData will be assigned to an object containing
    //geolocation information
    this.geoRoomArr;//created by geolocationService.makeGeoRoomArr.
    //The first element is user's lat/lon coordinates (to thousandth's place),
    //as a string. The next 8 elements are the neighboring lat/lon coordinates

    this.availableRooms = [];//availableRooms is assigned in
    //getRoomsSuccessCallback

    this.roomColorsCount;//roomColorsCount is assigned and adjusted
    //in assignRoomColorAndNum(), and keeps track of how many red, 
    //green, and blue rooms are available in the client's geo area

    this.roomToCreateColor;//setRoomToCreateColor is the color of
    //the room that will be created if this user creates a room

    this.nameInput;//this is attached to the nameInput input element
    //in createRoomOptionsPanel.html. It is used for customizing
    //the name of a room
    this.fbook = false;//this is toggled when the user checks the
    //box (in div.checkbox in createRoomOptionsPanel.html)
    //for making a room open only to facebook users

    //the options for the select element in createRoomOptionsPanel.html
    this.timerOptions = ['1:00', '2:00', '5:00', '10:00', '20:00']
    //the initial time that the select element in 
    //createRoomOptionsPanel.html is set to
    this.timerLength = '2:00'

    //when a user navigates to the main page, if they are authenticated
    //via facebook, user will be assigned to an object containing the
    //user's name and other info and isLoggedIn will be assigned to true
    this.user = {};
    this.isLoggedIn = false;

    //when geolocationCallFailed or getRoomsCallFailed are true, an error
    //message is shown to the user
    this.geolocationCallFailed = false;
    this.getRoomsCallFailed = false;

    //determines whether the menu for creating a room is open or closed.
    //It is toggled by openMenu()
    this.menuOpen = false;

    //openMenu is called when the user clicks on #create-room-button
    //in createRoomOptionsPanel.html
    this.openMenu = function() {
      ctrl.menuOpen = true;
    }

    $("body").css("background-color", "white");

    //getRoomByGeo is called just after the function definition.
    //It runs whenever a user navigates to the main page. Its
    //purpose is to show the user a list of available rooms near 
    //their geolocation, and join them to a socket geoRoom
    this.getRoomByGeo = function() {
      //get geolocation. getGeo is a promise
      var getGeo = geolocationService.getLocation()
        .then(geoSuccessCallback, geoErrorCallback);
    };

    ctrl.getRoomByGeo();
        
    //geoSuccessCallback is called by getRoomByGeo when the 
    //geolocationService.getLocation() method resolves the deferred that 
    //the geoGeo promise is associated with     
    function geoSuccessCallback (geoData) {
      ctrl.geoData = geoData; //geoData has three properties:
      //latitude, longitude, and geoLocated (a boolean)

      ctrl.geoRoomArr = geolocationService.makeGeoRoomArr(geoData)
      
      //geoRoomArrVal is an angular value
      geoRoomArrVal.geoRooms = ctrl.geoRoomArr;

      //this statement causes the user to join a geoRoom 
      socket.socket.emit("joinAnteroom", ctrl.geoRoomArr[0]);

      //getRooms is a promise
      var getRooms = roomCreationService.get(ctrl.geoRoomArr[0])
        .then(getRoomsSuccessCallback, getRoomsErrorCallback);

    }


    //geoSuccessCallback is called by getRoomByGeo when the 
    //geolocationService.getLocation() method rejects the deferred that 
    //the geoGeo promise is associated with   
    function geoErrorCallback() {
      ctrl.geolocationCallFailed = true;
    }

    //getRoomsSuccessCallback is called by geoSuccessCallback 
    //when the roomCreationService.get() method resolves the deferred 
    //that the getRooms promise is associated with  
    function getRoomsSuccessCallback(rooms) {
      ctrl.availableRooms = rooms;
      assignRoomColorAndNum(rooms);
    }


    //getRoomsErrorCallback is called by geoSuccessCallback 
    //when the roomCreationService.get() method rejects the deferred 
    //that the getRooms promise is associated with  
    function getRoomsErrorCallback() {
      ctrl.getRoomsCallFailed = true;
    }

    //the refreshRoomList event is emitted by the server whenever
    //a room is created or expires. It is sent to the members of
    //the relevant geoRoom
    socket.socket.on('refreshRoomList', function() {
      console.log("refreshRoomList event");
      var getRooms = roomCreationService.get(ctrl.geoRoomArr[0])
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

    //createRoom is called when the user clicks on a button to 
    //create a room (in createRoomOptionsPanel.html). As arguments,
    //it takes the color of the room and the type of room (lunch, chat)
    this.createRoom = function(color, type) {
      //lock will be true when a user has chosen to create a room that
      //is only open to facebook users
      var lock = ctrl.fbook ? 'facebook': null;
      //roomName will be non-null when a user has chosen to create a room
      //with a custom name
      var roomName = ctrl.nameInput || null;
      //timerLength determines how much time a room will be active for.
      //Users can adjust this by using the select element in 
      //createRoomOptionsPanel.html
      var timerLength = ctrl.timerLength;
      roomCreationService.create({lat: ctrl.geoData.lat,
                            lon: ctrl.geoData.lon, 
                            color: color, 
                            geoRoomArr: ctrl.geoRoomArr,
                            type: type,
                            lock: lock,
                            roomName: roomName,
                            timerLength: timerLength});
    };

    this.enterRoom = function(roomNumber, color, type) {
      if (roomNumber) {
        roomCreationService.enter({roomNumber: roomNumber, 
                             color: color, 
                             geoRoom: ctrl.geoRoom, 
                             isLoggedIn: Auth.isLoggedIn(),
                             type: type});
      }
    };

    //setUser is passed as an argument to Auth.isLoggedInAsync, 
    //which is called just after the function definition.
    //When it is called by Auth.isLoggedInAsync, it is passed
    //a boolean argument indicating whether a user is logged in
    //or not. If a user is logged in, User.get() will be called,
    //in order to get information about the user from the database

    this.usernameIsSet = false;
console.log('name', this.username)
console.log('val', usernameVal.name)
    if (!usernameVal.name) {
      this.username = nameGeneratorService.getName();
      usernameVal.name = this.username;
    } else {
      this.username = usernameVal.name;
    }


    function setUser(validUser) {
       if (validUser) {
        ctrl.isLoggedIn = true;
        // User.get returns a $resource that takes accepts a callback
        ctrl.user = User.get({}, function(user) {
          ctrl.username = ctrl.user.facebook.first_name + ' ' + 
                          ctrl.user.facebook.last_name[0] + '.';
          ctrl.setUsername();
          usernameVal.name = ctrl.username;
        })
      }
    }

    Auth.isLoggedInAsync(setUser);

    this.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    this.logout = function() {
      Auth.logout();
      $state.reload();
    }

    this.setUsername = function() {
      if(ctrl.username.length > 0) {
        this.usernameIsSet = !this.usernameIsSet;
        usernameVal.name = this.username;
      }
    }

  });
