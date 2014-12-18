'use strict';

angular.module('roomApp')
  .controller('BackgammonCtrl', function ($stateParams, $scope,
                                      roomSocketsService,
                                      socket, gameLogic, $http) {

    var ctrl = this;

    this.params = $stateParams;
    var roomId = this.params.roomId;

    this.gameState = {};

    this.pieceToMove = null;
   
    //each element in possibleMove corresponds to a space on the board.
    //If the element is changed to 1, then a green square will be shown in
    //that space, meaning that a specific piece can be moved there
    this.possibleMove = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    this.showOffBoardBlue = false;
    this.showOffBoardGreen = false;

    this.checkSpaces = function(spaceNumber, color) {
      gameLogic.checkSpaces(spaceNumber, color, ctrl, ctrl.gameState);
    }
  
    this.checkSpacesFromJail = function(color) {
      gameLogic.checkSpacesFromJail(color, ctrl, ctrl.gameState);
    }
 
    this.moveOffBoard = function(color) {
      gameLogic.moveOffBoard(color, ctrl, ctrl.gameState);
    }

    this.rollFunction = function() {
      gameLogic.rollFunction(ctrl, ctrl.gameState);
    }

    this.movePiece = function(spaceNumber) {
      gameLogic.movePiece(spaceNumber, ctrl, ctrl.gameState);      
    }

    this.changeTurn = function() {
      gameLogic.changeTurn(ctrl, ctrl.gameState);      
    }

    this.returnArray = function(num) {
      var arr = []; 
      for (var i = 0; i < num; i++) {
        arr.push(i);
      }
      return arr;
    };

    this.newGame = function() {
      $http.post("/api/backgammonRoom", {

        roomId: roomId,
        turn : "blue",
        roll : [0,0],
        numberRolls : 2,
        pieces : [2,0,0,0,0,5,0,3,0,0,0,5,5,0,0,0,3,0,5,0,0,0,0,2],
        piecesColor : ["green",0,0,0,0,"blue",0,"blue",0,0,0,"green",
                     "blue",0,0,0,"green",0,"green",0,0,0,0,"blue"],

        greenHomeNumber : 5,
        blueHomeNumber : 5,
        greenPiecesInJail : 0,
        bluePiecesInJail : 0,
        blueScore : 0,
        greenScore : 0,
        showRollButton : true
      })
      .success(function(data) {
        ctrl.gameState = data;
      })
      .error(function(error) {
        console.log(error);
      });
    }

    this.saveGame = function(gameId) {
      delete this.gameState.__v;
      delete this.gameState._id;
      $http.put("/api/backgammonRoom/" + roomId, this.gameState)

      .success(function(data) {


      })
      .error(function(error) {

      })
    };

    this.getGame = function(roomId) {
      $http.get("/api/backgammonRoom/" + roomId)

      .success(function(data) {
        ctrl.gameState = data;
      })

      .error(function(error) {
         console.log(error);
      });
    };

    this.getGame(roomId);

    socket.socket.on("updateGame", function(doc) {
      ctrl.gameState = doc
   });
  })

.directive("space", function() {
  return {
    restrict: 'E',
    templateUrl: 'app/room/backgammon/space.html'
  };
})