'use strict';

angular.module('roomApp')
  .controller('LunchroomCtrl', function ($scope, $stateParams, socket, $http, 
  	                                    lunchRoomService, fourSquareService, 
                                        geoRoomArrVal, usernameVal) {

    var ctrl = this;

    this.params = $stateParams;
    var roomId = this.params.roomId;
    this.roomColor = this.params.color;

    var geoRoomArr = geoRoomArrVal.geoRooms;
    this.user = usernameVal.name;
    
    //maxVotes and winner are assigned by the callback of
    //the 'updateRoom' socket event listener in lunchRoomService
    this.maxVotes;
    this.winner;

    this.roomData; //assigned in getRoomSuccessCallback

    this.errorUpdatingRoomData = false; //assigned to true when
    //getRoomErrorCallback is called, and causes a message to
    //be shown to the user

    this.errorSubmittingRest = false; //assigned to true when
    //submitMessageErrorCb is called, and causes a message to
    //be shown to the user

    this.restaurants = []; //assigned to the array of restaurants
    //returned by getFourSquare, if getFourSquare is called

    this.inputField = ''; //sets the input field to be empty initially

    //getRoom is called whenever a user enters a room. The method call
    //is just below the function definition. Its purpose is to make available
    //to the client any info specifc to this type of room
    this.getRoom = function(roomId) {
      var promise = lunchRoomService.get(roomId, ctrl.roomType)
      .then(getRoomSuccessCallback, getRoomErrorCallback)
    };

    this.getRoom(roomId);

    function getRoomSuccessCallback(room) {
      ctrl.roomData = room;
    }

    function getRoomErrorCallback(error) {
      ctrl.errorUpdatingRoomData = true;
    }
    
    //submitInput is called when the user submits the name of a restaurant
    //It calls lunchRoomService.submitInput with a number of parameters that
    //varies depending on whether the user is logged in
    this.submitInput = function() {
 
      if (ctrl.inputField.length < 100) {
        lunchRoomService.submitInput(ctrl.inputField, roomId, this.user);
        //to empty the input field:
        ctrl.inputField = '';
      }
  
    }

    //vote is called either by up/downvoting an already-selected
    //restaurant, or selecting a restaurant from the foursquare list
    this.vote = function(choice, upOrDown, event, index) {
      //if called by up/downvoting
      if (upOrDown) {
        lunchRoomService.toggleColors(ctrl.roomColor, event)
      }

      else {
        $(event.target).parent().addClass('animated fadeOutUp');
        ctrl.restaurants.splice(index,1);
      } 

      lunchRoomService.submitVote(roomId, choice, upOrDown, this.user);

    };


    this.seeVotes = function(event) {
      $(event.target).closest('.list-group-item').next().toggleClass('ng-hide')
    }

///////////////////////////////////////////////////////////////
// fourSquare API call, hide, and show functions
    this.getFourSquare = function() {
      var promise = fourSquareService.get(roomId)
        .then(function(restaurants) {
          ctrl.restaurants = restaurants;
        },
        function(error) {
        });
    };

    this.showFoursquare = function() {
      fourSquareService.show(event);
    }

    this.hideFoursquare = function() {
      fourSquareService.hide(event);
    }

////////////////////////////////////////////////////////////////


    //facebook login stuff
    // this.user = Auth.getCurrentUser();
    // this.isLoggedIn = Auth.isLoggedIn();

    // set up socket event listeners
    lunchRoomService.listen(roomId, $scope, ctrl, this.user);


    //returnArray is used to display the correct number of dollar signs
    //for the list of restaurants from foursquare
    this.returnArray = function(num) {
          var arr = []; 
          for (var i = 0; i < num; i++) {
            arr.push(i);
          }
          return arr;
    };


  });
