'use strict';

angular.module('roomApp')
  .factory('gameLogic', function () {
return {
  
    //called when player clicks the roll button
    rollFunction : function(ctrl, gameState) {

      gameState.roll[0] = Math.floor(Math.random() * 6 + 1);
      gameState.roll[1] = Math.floor(Math.random() * 6 + 1);
      
      //if player rolled doubles:
      if (gameState.roll[0] === gameState.roll[1]) {
        gameState.numberRolls = 4;
      }

      gameState.showRollButton = false;
      ctrl.saveGame(ctrl.roomId);

    },

    //called when a player clicks on a piece (except pieces in jail),
    //and it's their turn
    checkSpaces : function(spaceNumber, color, ctrl, gameState) {

      ctrl.pieceToMove  = spaceNumber; 
      
      //clear all green squares from the previous checkSpaces call
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
      
      if (gameState.roll[0] !== 0) {
        this.checkIfMovePossible(space1, color, ctrl, gameState);
        this.checkOffBoardSpecialMove(space1, color, ctrl, gameState);
      }
      if (gameState.roll[1] !== 0) {
        this.checkIfMovePossible(space2, color, ctrl, gameState);
        this.checkOffBoardSpecialMove(space2, color, ctrl, gameState);
      }

    },

    //called when player clicks on a piece that is in jail,
    //and it's their turn
    checkSpacesFromJail : function(color, ctrl, gameState) {
      
      if (color === "green") {
        //pieceToMove is at space -1;
        var space1 = gameState.roll[0] - 1;
        var space2 = gameState.roll[1] - 1;
      }
      
      else if (color === "blue") {
        //pieceToMove is at space 24;
        var space1 = 24 - gameState.roll[0];
        var space2 = 24 - gameState.roll[1];
      }
      
      if (gameState.roll[0] !== 0) {
        this.checkIfMovePossible(space1, color, ctrl, gameState);
      }
      if (gameState.roll[1] !== 0) {
        this.checkIfMovePossible(space2, color, ctrl, gameState);
      }

    },

    checkIfMovePossible : function(spaceNumber, color, ctrl, gameState) {
        //if the space has the same color pieces as the piece potentially being moved, or
        //if there is only piece belonging to the opponent
        if (color === gameState.piecesColor[spaceNumber] || gameState.pieces[spaceNumber] < 2) {
          ctrl.possibleMove[spaceNumber] = 1; 
        }

        if (spaceNumber === -1 && color === "blue" && gameState.blueHomeNumber === 15) {
          ctrl.showOffBoardBlue = true;
        }
        else if (spaceNumber === 24 && color === "green" && gameState.greenHomeNumber === 15) {
          ctrl.showOffBoardGreen = true;
        }

    },

    //this would be a move where, for instance, a roll of 6 is used to move a piece off the
    //board that was only 4 spaces away. This is only legal if the piece has no pieces behind
    //it (trailingPieces)
    checkOffBoardSpecialMove : function(spaceNumber, color, ctrl, gameState) {

      if (space1 < -1 && color === "blue" && gameState.blueHomeNumber === 15) {

        var trailingPieces = false;
        
        //the pieceToMove is on space 0,1,2,3, or 4, so
        //check for trailingPieces from that space to space 5
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
        
        //the pieceToMove is on space 19,20,21,22 ,or 23, so
        //check for trailingPieces from space 18 to that space
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