'use strict';

angular.module('roomApp')
  .controller('BackgammonCtrl', function ($stateParams, $scope,
                                      roomSocketsService,
                                      socket, gameLogic, $http) {

    var ctrl = this;

    this.params = $stateParams;
    var roomId = this.params.roomId;

    ctrl.gameState = {};

    this.pieceToMove = null;
   
    this.possibleMove = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    this.showOffBoardBlue = false;
    this.showOffBoardGreen = false;

    this.rollFunction = function() {
      gameLogic.rollFunction(ctrl, ctrl.gameState);
    }

    this.checkSpacesFromJail = gameLogic.checkSpacesFromJail;

    this.checkOffBoardSpaces = gameLogic.checkOffBoardSpaces;

    this.moveOffBoard = gameLogic.moveOffBoard;

    this.checkSpaces = gameLogic.checkSpaces;

    this.movePiece = function(spaceNumber) {
       gameLogic.movePiece(spaceNumber, ctrl, ctrl.gameState);      
    }

    this.changeTurn = function() {
      gameLogic.changeTurn(ctrl.gameState);      
    }

    this.gameList = [];

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
      $http.put("/api/backgammonRoom/" + roomId, {
            turn : this.gameState.turn,
            roll : this.gameState.roll,
            showRollButton : this.gameState.showRollButton,
            numberRolls : this.gameState.numberRolls,
            pieces : this.gameState.pieces,
            piecesColor : this.gameState.piecesColor, 
            greenHomeNumber : this.gameState.greenHomeNumber,
            blueHomeNumber : this.gameState.blueHomeNumber,
            greenPiecesInJail : this.gameState.greenPiecesInJail,
            bluePiecesInJail : this.gameState.bluePiecesInJail,
            blueScore : this.gameState.blueScore,
            greenScore : this.gameState.greenScore

      }).success(function(data) {


      });
    };

    ctrl.gameState.pieces = {piecesArray: []};

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