'use strict';

angular.module('roomApp')
  .factory('gameLogic', function () {
return {
  
    rollFunction : function(ctrl, gameState) {
      gameState.roll[0] = Math.floor(Math.random() * 6 + 1);
      gameState.roll[1] = Math.floor(Math.random() * 6 + 1);
      if (gameState.roll[0] === gameState.roll[1]) {
        gameState.numberRolls = 4;
      }

      gameState.showRollButton = false;
      ctrl.saveGame(ctrl.roomId);
    },

    checkSpacesFromJail : function(color, ctrl, gameState) {
      if (color === "green") {
        ctrl.pieceToMove = -1;
        var space1 = gameState.roll[0] - 1;
        //-1 to account for 0-indexing of spaces
        var space2 = gameState.roll[1] - 1;
      }
      else if (color === "blue") {
        ctrl.pieceToMove = 24;
        var space1 = 24 - gameState.roll[0];
        var space2 = 24 - gameState.roll[1];
      }
      if (gameState.roll[0] !== 0 && (color === gameState.piecesColor[space1] || gameState.pieces[space1] < 2)) {
        ctrl.possibleMove[space1] = 1; 
      }
      if (gameState.roll[1] !== 0 && (color === gameState.piecesColor[space2] || gameState.pieces[space2] < 2)) {
        ctrl.possibleMove[space2] = 1; 
      }
    },

    moveOffBoard : function(color, ctrl, gameState) {
      gameState.pieces[ctrl.pieceToMove] -= 1;
      if (gameState.pieces[ctrl.pieceToMove] === 0) {
           gameState.piecesColor[ctrl.pieceToMove] = 0;
       }

      if (color === "blue") {
        gameState.blueScore++;
        var difference = Math.abs(- 1 - ctrl.pieceToMove);
      }
      else if (color === "green") {
        gameState.greenScore++;
        var difference = 24 - ctrl.pieceToMove;
      }
      if (gameState.numberRolls < 3) {
        if (difference === gameState.roll[0]){
            gameState.roll[0] = 0;
        }
        else if (difference === gameState.roll[1]){
            gameState.roll[1] = 0;
        }
        else if (gameState.roll[0] > difference  || gameState.roll[1] > difference){
            if (gameState.roll[0] > difference  && gameState.roll[1] > difference) {
                gameState.roll[0] <= gameState.roll[1] ? gameState.roll[0] = 0 : gameState.roll[1] = 0;
            }
            else if (gameState.roll[0] > difference){
                gameState.roll[0] = 0;
            }
            else if (gameState.roll[1] > difference){
                gameState.roll[1] = 0;
            }
        }
      }
      else {
          gameState.numberRolls-- ;
      }

//at end of function
       for (var i = 0; i < ctrl.possibleMove.length; i++) {
            ctrl.possibleMove[i] = 0;
       }
        ctrl.showOffBoardGreen = false;
        ctrl.showOffBoardBlue = false;

       if (!gameState.roll[0] && !gameState.roll[1]) {
          gameState.turn === "green" ? gameState.turn = "blue" :
          gameState.turn = "green";
          gameState.showRollButton = true;
       }
       ctrl.saveGame(ctrl.roomId);    
    },

    checkSpaces : function(spaceNumber, color, ctrl, gameState) {
      ctrl.pieceToMove  = spaceNumber; 
      for (var i = 0; i < ctrl.possibleMove.length; i++) {
        ctrl.possibleMove[i] = 0;
      }
      ctrl.showOffBoardGreen = false;
      ctrl.showOffBoardBlue = false;
      if (color === "blue" && gameState.bluePiecesInJail === 0) {
        var space1 = spaceNumber - gameState.roll[0];
        var space2 = spaceNumber - gameState.roll[1];
      }
      else if ((color === "green" && gameState.greenPiecesInJail === 0)) {
        var space1 = spaceNumber + gameState.roll[0];
        var space2 = spaceNumber + gameState.roll[1];
      }

      if (gameState.roll[0] !== 0 && (color === gameState.piecesColor[space1] || gameState.pieces[space1] < 2)) {
        ctrl.possibleMove[space1] = 1;
        }
      if (gameState.roll[1] !== 0 && (color === gameState.piecesColor[space2] || gameState.pieces[space2] < 2)) {
        ctrl.possibleMove[space2] = 1; 
      }

      if (space1 === -1 && color === "blue" && gameState.blueHomeNumber === 15) {
            ctrl.showOffBoardBlue = true;
        }
      else if (space1 === 24 && color === "green" && gameState.greenHomeNumber === 15) {
            ctrl.showOffBoardGreen = true;
        }
      if (space2 === -1 && color === "blue" && gameState.blueHomeNumber === 15) {
            ctrl.showOffBoardBlue = true;
        }
      else if (space2 === 24 && color === "green" && gameState.greenHomeNumber === 15) {
            ctrl.showOffBoardGreen = true;
        }
      //////only if there are no pieces behind pieceToMove
      if (space1 < -1 && color === "blue" && gameState.blueHomeNumber === 15) {
            var trailingPieces = false;
            for (var i = ctrl.pieceToMove + 1; i <= 5; i++) {
              if (gameState.pieces[i] > 0) {
                trailingPieces = true;
              }
            }
            if (!trailingPieces) {
              ctrl.showOffBoardBlue = true;
            }
            trailingPieces = false;
        }
      else if (space1 > 24 && color === "green" && gameState.greenHomeNumber === 15) {
            var trailingPieces = false;
            for (var i = 18; i < ctrl.pieceToMove; i++) {
              if (gameState.pieces[i] > 0) {
                trailingPieces = true;
                break;
              }
            }
            if (!trailingPieces) {
              ctrl.showOffBoardGreen = true;
            }
            trailingPieces = false;
        }
      if (space2 < -1 && color === "blue" && gameState.blueHomeNumber === 15) {
            var trailingPieces = false;
            for (var i = ctrl.pieceToMove + 1; i <= 5; i++) {
              if (gameState.pieces[i] > 0) {
                trailingPieces = true;
                break;
              }
            }
            if (!trailingPieces) {
              ctrl.showOffBoardBlue = true;
            }
            trailingPieces = false;
        }
      else if (space2 > 24 && color === "green" && gameState.greenHomeNumber === 15) {
            var trailingPieces = false;
            for (var i = 18; i < ctrl.pieceToMove; i++) {
              if (gameState.pieces[i] > 0) {
                trailingPieces = true;
                break;
              }
            }
            if (!trailingPieces) {
              ctrl.showOffBoardGreen = true;
            }
            trailingPieces = false;
        }
    ///////
    },

    movePiece : function(spaceNumber, ctrl, gameState) {
       gameState.pieces[ctrl.pieceToMove] -= 1;
       if (gameState.pieces[ctrl.pieceToMove] === 0) {
           gameState.piecesColor[ctrl.pieceToMove] = 0;
       }
       ctrl.showOffBoardGreen = false;
       ctrl.showOffBoardBlue = false;
       if (gameState.pieces[spaceNumber] === 1 && 
          gameState.piecesColor[spaceNumber] !== gameState.turn) {
            gameState.piecesColor[spaceNumber] = gameState.turn;
            if (gameState.turn == "blue") {
               gameState.greenPiecesInJail++;
               if (spaceNumber >= 18) {
                  gameState.greenHomeNumber--;
               } 
            }
            else if (gameState.turn == "green") {
               gameState.bluePiecesInJail++;
               if (spaceNumber <= 5) {
                   gameState.blueHomeNumber--;
               } 
            }  
       }
       else if (gameState.pieces[spaceNumber] === 0) {
            gameState.pieces[spaceNumber] += 1;
            gameState.piecesColor[spaceNumber] = gameState.turn;
       }
       else {
            gameState.pieces[spaceNumber] += 1;
       }
       for (var i = 0; i < ctrl.possibleMove.length; i++) {
            ctrl.possibleMove[i] = 0;
       }
       
       if (gameState.numberRolls < 3) {
         Math.abs(spaceNumber - ctrl.pieceToMove) === gameState.roll[0] ?
           gameState.roll[0] = 0 : gameState.roll[1] = 0;
       }
       else {
          gameState.numberRolls-- ;
       }

       if (gameState.turn === "blue" && gameState.bluePiecesInJail > 0) {
          gameState.bluePiecesInJail-- ;
       }

       else if (gameState.turn === "green" && gameState.greenPiecesInJail > 0) {
          gameState.greenPiecesInJail-- ;
       }

       if (gameState.turn === "green" && ctrl.pieceToMove < 18 && spaceNumber >= 18) {
           gameState.greenHomeNumber++;
       }

       else if (gameState.turn === "blue" && ctrl.pieceToMove > 5 && spaceNumber <= 5) {
           gameState.blueHomeNumber++;
       }


       if (!gameState.roll[0] && !gameState.roll[1]) {
          gameState.turn === "green" ? gameState.turn = "blue" :
          gameState.turn = "green";
          gameState.showRollButton = true;
       }
       ctrl.saveGame(ctrl.roomId);
    },

    changeTurn : function(ctrl, gameState) {
      gameState.turn === "blue" ? gameState.turn = "green":
         gameState.turn = "blue";
       gameState.roll[0] = 0;
       gameState.roll[1] = 0;
       gameState.numberRolls = 2;
       ctrl.showOffBoardBlue = false;
       ctrl.showOffBoardGreen = false;
       for (var i = 0; i < ctrl.possibleMove.length; i++) {
         ctrl.possibleMove[i] = 0;
       }
       gameState.showRollButton = true;
       ctrl.saveGame(ctrl.roomId);
    }
   };
});