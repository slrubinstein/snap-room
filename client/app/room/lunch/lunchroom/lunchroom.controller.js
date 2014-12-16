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
    
    //maxVotes and winner are assigned by the callback of the 'updateRoom' 
    //socket event listener in lunchRoomService, if data.event === 'timeUp'
    this.maxVotes;
    this.winner;

    this.roomData; //assigned in getRoomSuccessCallback, and also by
    //by the callback of the 'updateRoom' socket event listener in 
    //lunchRoomService, if data.event === 'vote'

    this.restaurants = []; //assigned to the array of restaurants
    //returned by getFourSquare, if getFourSquare is called

    this.inputField = ''; //sets the input field to be empty initially

    this.errorUpdatingRoomData = false; //assigned to true when
    //getRoomErrorCallback is called, and causes a message to
    //be shown to the user

    this.errorSubmittingRest = false; //assigned to true when
    //submitMessageErrorCb is called, and causes a message to
    //be shown to the user

    this.errorSubmittingVote = false; //assigned to true when
    //submitVoteErrorCb is called, and causes a message to
    //be shown to the user

    this.fourSquareError = false; //assigned to true when
    //submitVoteErrorCb is called, and causes a message to
    //be shown to the user

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
        var submitRestName = lunchRoomService.submitInput(ctrl.inputField, 
          roomId, this.user)
        .then(submitMessageSuccessCb, submitMessageErrorCb);
        //to empty the input field:
        ctrl.inputField = '';
      }
    }

    function submitMessageSuccessCb(data) {
       socket.socket.emit('updateRoom', roomId, {event: 'vote', doc: data})
    }

    function submitMessageErrorCb() {
       ctrl.errorSubmittingRest = true; 
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

      var submitRestVote = lunchRoomService.submitVote(roomId, choice, upOrDown, this.user)
        .then(submitVoteSuccessCb, submitVoteErrorCb)

    };

    function submitVoteSuccessCb(data) {
      socket.socket.emit('updateRoom', roomId, {event: 'vote', doc: data})
    }

    function submitVoteErrorCb() {
      ctrl.errorSubmittingVote = true; 
    }


    //to see the usernames of voters for each restaurant
    this.seeVotes = function(event) {
      lunchRoomService.seeVotes(event);
    }


    //fourSquare API call
    this.getFourSquare = function() {
      var promise = fourSquareService.get(roomId)
        .then(fourSquareSuccessCb, fourSquareErrorCb)
    };

    function fourSquareSuccessCb(resp) {
      if (!resp.data) return;
      if (!resp.data.response) return;
      if (!resp.data.response.groups) return;
      if (!resp.data.response.groups[0]) return;
      var restaurants = resp.data.response.groups[0].items;
      ctrl.restaurants = restaurants;
    }
    
    function fourSquareErrorCb () {
      ctrl.fourSquareError = true;
    }
        
    this.showFoursquare = function() {
      fourSquareService.show(event);
    }

    this.hideFoursquare = function() {
      fourSquareService.hide(event);
    }

    //returnArray is used to display the correct number of 
    //dollar signs for the list of restaurants from foursquare
    this.returnArray = function(num) {
      var arr = []; 
      for (var i = 0; i < num; i++) {
        arr.push(i);
      }
      return arr;
    };

    // set up socket event listeners
    lunchRoomService.listen(roomId, $scope, ctrl, this.user);


  });
