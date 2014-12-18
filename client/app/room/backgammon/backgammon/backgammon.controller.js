'use strict';

angular.module('roomApp')
  .controller('BackgammonCtrl', function ($stateParams, $scope,
                                      roomSocketsService,
                                      socket, gameLogic, $http,
                                      backgammonService) {

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

    this.errorCreatingGame = false; //assigned to true in error callback
    //for backgammonService.create
    this.errorSavingGame = false; //assigned to true in error callback
    //for backgammonService.save
    this.errorFindingGameData = false; //assigned to true in error callback
    //for backgammonService.get

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

    this.manualChangeTurn = function() {
      gameLogic.manualChangeTurn(ctrl, ctrl.gameState);      
    }

    this.returnArray = function(num) {
      var arr = []; 
      for (var i = 0; i < num; i++) {
        arr.push(i);
      }
      return arr;
    };

    this.newGame = function() {
      var startNewGame = backgammonService.create(roomId)
      
        .success(function(data) {
          ctrl.gameState = data;
        })
        .error(function(error) {
          ctrl.errorCreatingGame = true;
        })
    }

    this.saveGame = function() {
      delete this.gameState.__v;
      delete this.gameState._id;

      var saveGameState = backgammonService.save(roomId, 
                                        this.gameState)

        .success(function(data) {


        })
        .error(function(error) {
          ctrl.errorSavingGame = true;
        })
    };

    this.getGame = function(roomId) {
      var getGameState = backgammonService.get(roomId)

        .success(function(data) {
          ctrl.gameState = data;
        })

        .error(function(error) {
          ctrl.errorFindingGameData = true;
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