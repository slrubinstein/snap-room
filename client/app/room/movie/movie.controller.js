'use strict';

angular.module('roomApp')
  .controller('MovieroomCtrl', function ($scope, $stateParams, socket, $http, 
  	                    $interval, movieRoomService, Auth, $state, roomCreationService,
                         rottenTomatoesService, roomSocketsService, $window,
                         personCounterService, geoRoomArrVal, usernameVal) {


    var ctrl = this;

    this.params = $stateParams;
    var roomNumber = this.params.roomNumber;
    var geoRoomArr = geoRoomArrVal.geoRooms;
    this.roomColor = this.params.color;
    this.user = usernameVal.name;
    this.maxVotes;
    this.winner;

    //roomData, roomType, and roomColor are all assigned in
    //getRoomSuccessCallback
    this.roomData;

    this.movies = []; //assigned to the array of movies
    //returned by getRottenTomatoes, if getRottenTomatoes is called

    this.inputField = ''; //sets the input field to be empty initially

    //getRoom is called whenever a user enters a room. The method call
    //is just below the function definition. Its purpose is to make available
    //to the client any info that has already been posted in the room, the
    //amount of time left before the room expires, and the room color/type,
    //as well as to start the interval that runs the timer.
    this.getRoom = function(roomNumber) {
      var promise = movieRoomService.get(roomNumber, ctrl.roomType)
      .then(getRoomSuccessCallback, getRoomErrorCallback)
    };

    this.getRoom(roomNumber);

    function getRoomSuccessCallback(room) {
        ctrl.roomData = room;
    }

    function getRoomErrorCallback(error) {
      
    }
    
    //submitInput is called when the user submits the name of a restaurant
    //or a message. It calls movieRoomService.submitInput with a number of
    //parameters that varies depending on whether the user is logged in
    this.submitInput = function() {
      var type = ctrl.roomType;
      var picture = 'https://pbs.twimg.com/profile_images/413202074466131968/ZeuqFOYQ_normal.jpeg'; 
 
      if (ctrl.inputField.length < 100) {
        movieRoomService.submitInput(roomNumber, this.user, picture, type);
        //to empty the input field:
        ctrl.inputField = '';
      }
  
    }

    //vote is called either by up/downvoting an already-selected
    //restaurant, or selecting a restaurant from the RottenTomatoes list
    this.vote = function(choice, upOrDown, event, index) {
      //if called by up/downvoting
      if (upOrDown) {
        movieRoomService.toggleColors(ctrl.roomColor, event)
      }

      else {
        $(event.target).parent().addClass('animated fadeOutUp');
        ctrl.movies.splice(index,1);
      } 

      movieRoomService.submitVote(roomNumber, choice, upOrDown, this.user);

    };


    this.seeVotes = function(event) {
      $(event.target).closest('.list-group-item').next().toggleClass('ng-hide')
    }

///////////////////////////////////////////////////////////////
// RottenTomatoes API call, hide, and show functions
    this.getRottenTomatoes = function() {
      var promise = RottenTomatoesService.get(roomNumber)
        .then(function(movies) {
          ctrl.movies = movies;
        },
        function(error) {
        });
    };

    this.showRottenTomatoes = function() {
      RottenTomatoesService.show(event);
    }

    this.hideRottenTomatoes = function() {
      RottenTomatoesService.hide(event);
    }

    // set up socket event listeners
    movieRoomService.listen(roomNumber, $scope, ctrl, this.user);


    //returnArray is used to display the correct number of dollar signs
    //for the list of movies from RottenTomatoes
    this.returnArray = function(num) {
          var arr = []; 
          for (var i = 0; i < num; i++) {
            arr.push(i);
          }
          return arr;
    };


  });
