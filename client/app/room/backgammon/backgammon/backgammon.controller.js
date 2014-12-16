'use strict';

angular.module('roomApp')
  .controller('BackgammonCtrl', function ($stateParams, $scope,
                                      roomSocketsService,
                                      socket, gameLogic, $http) {

    var ctrl = this;

    this.params = $stateParams;
    var roomId = this.params.roomId;

    this.pieceToMove = null;
   
    this.possibleMove = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    this.showOffBoardBlue = false;
    this.showOffBoardGreen = false;

    this.rollFunction = function() {
      gameLogic.rollFunction(ctrl);
    }

    this.checkSpacesFromJail = gameLogic.checkSpacesFromJail;

    this.checkOffBoardSpaces = gameLogic.checkOffBoardSpaces;

    this.moveOffBoard = gameLogic.moveOffBoard;

    this.checkSpaces = gameLogic.checkSpaces;

    this.movePiece = function(spaceNumber) {
       gameLogic.movePiece(spaceNumber, ctrl);      
    }

    this.changeTurn = function() {
      gameLogic.changeTurn(ctrl);      
    }

    this.gameList = [];

    this.returnArray = function(num) {
      var arr = []; 
      for (var i = 0; i < num; i++) {
        arr.push(i);
      }
      return arr;
    };
    // feels like a factory is needed
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
        //ctrl.gameID = data._id;
        ctrl.turn = "blue";
        ctrl.roll = [0,0];
        ctrl.numberRolls = 2;
        ctrl.pieces = [2,0,0,0,0,5,0,3,0,0,0,5,5,0,0,0,3,0,5,0,0,0,0,2];
        ctrl.piecesColor = ["green",0,0,0,0,"blue",0,"blue",0,0,0,"green",
                     "blue",0,0,0,"green",0,"green",0,0,0,0,"blue"];

        ctrl.greenHomeNumber = 5;
        ctrl.blueHomeNumber = 5;
        ctrl.greenPiecesInJail = 0;
        ctrl.bluePiecesInJail = 0;
        ctrl.blueScore = 0;
        ctrl.greenScore = 0;
        ctrl.showRollButton = true;
     })
      .error(function(error) {
         console.log(error);
      });
    }

    this.saveGame = function(gameId) {
      $http.put("/api/backgammonRoom/" + roomId, {
            turn : this.turn,
            roll : this.roll,
            showRollButton : this.showRollButton,
            numberRolls : this.numberRolls,
            pieces : this.pieces,
            piecesColor : this.piecesColor, 
            greenHomeNumber : this.greenHomeNumber,
            blueHomeNumber : this.blueHomeNumber,
            greenPiecesInJail : this.greenPiecesInJail,
            bluePiecesInJail : this.bluePiecesInJail,
            blueScore : this.blueScore,
            greenScore : this.greenScore

      }).success(function(data) {


      });
    };

    ctrl.pieces = {piecesArray: []};

    this.getGame = function(roomId) {
      $http.get("/api/backgammonRoom/" + roomId)
      .success(function(data) {
        ctrl.turn = data.turn;
        ctrl.roll = data.roll;
        ctrl.showRollButton = data.showRollButton;
        ctrl.numberRolls = data.numberRolls;
        ctrl.pieces = data.pieces;
        ctrl.piecesColor = data.piecesColor;
        ctrl.greenHomeNumber = data.greenHomeNumber;
        ctrl.blueHomeNumber = data.blueHomeNumber;
        ctrl.greenPiecesInJail = data.greenPiecesInJail;
        ctrl.bluePiecesInJail = data.bluePiecesInJail;
        ctrl.blueScore = data.blueScore;
        ctrl.greenScore = data.greenScore;
     })

      .error(function(error) {
         console.log(error);
      });
    };

  this.getGame(roomId);

   socket.socket.on("updateGame", function(doc) {
       ctrl.turn = doc.turn;
       ctrl.roll = doc.roll;
       ctrl.showRollButton = doc.showRollButton;
       ctrl.numberRolls = doc.numberRolls;
       ctrl.pieces = doc.pieces;
       ctrl.piecesColor = doc.piecesColor; 
       ctrl.greenHomeNumber = doc.greenHomeNumber;
       ctrl.blueHomeNumber = doc.blueHomeNumber;
       ctrl.greenPiecesInJail = doc.greenPiecesInJail;
       ctrl.bluePiecesInJail = doc.bluePiecesInJail;
       ctrl.blueScore = doc.blueScore;
       ctrl.greenScore = doc.greenScore;
   });
  })

.directive("space", function() {
  return {
    restrict: 'E',
    templateUrl: 'app/room/backgammon/space.html'
  };
})
