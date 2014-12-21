'use strict';

angular.module('roomApp')
  .factory('gameLogic', function () {
return {
  
    pieceToMove : null,

    //called when player clicks the roll button
    rollFunction : function(ctrl, gameState) {

      gameState.roll[0] = Math.floor(Math.random() * 6 + 1);
      gameState.roll[1] = Math.floor(Math.random() * 6 + 1);
      
      //if player rolled doubles:
      if (gameState.roll[0] === gameState.roll[1]) {
        gameState.numberRolls = 4;
      }

      gameState.showRollButton = false;
      ctrl.saveGame();

    },

    //called when a player clicks on a piece (except pieces in jail),
    //and it's their turn
    checkSpaces : function(spaceNumber, color, ctrl, gameState) {

      this.pieceToMove  = spaceNumber; 
      
      this.clearGreenSquares(ctrl);

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
      
      this.clearGreenSquares(ctrl);

      if (color === "green") {
        this.pieceToMove = -1;
        var space1 = gameState.roll[0] - 1;
        var space2 = gameState.roll[1] - 1;
      }
      
      else if (color === "blue") {
        this.pieceToMove = 24;
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

      if (spaceNumber < -1 && color === "blue" && gameState.blueHomeNumber === 15) {

        var trailingPieces = false;
        
        //pieceToMove is on space 0,1,2,3, or 4, so check for 
        //trailingPieces from that space + 1 to space 5
        for (var i = this.pieceToMove + 1; i <= 5; i++) {
          if (gameState.pieces[i] > 0) {
            trailingPieces = true;
          }
        }
        
        if (!trailingPieces) {
          ctrl.showOffBoardBlue = true;
        }
        
        trailingPieces = false;
      }

      else if (spaceNumber > 24 && color === "green" && gameState.greenHomeNumber === 15) {
        
        var trailingPieces = false;
        
        //pieceToMove is on space 19,20,21,22 ,or 23, so check for 
        //trailingPieces from space 18 to that space - 1
        for (var i = 18; i < this.pieceToMove; i++) {
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
    
    //called by clicking on green square
    movePiece : function(spaceNumber, ctrl, gameState) {
       
       this.removePieceFromCurrentSpace(ctrl, gameState);
       
       //if moving to a space where an opponent's piece
       //can be attacked
       if (gameState.pieces[spaceNumber] === 1 && 
          gameState.piecesColor[spaceNumber] !== gameState.turn) {
            
            //change the color assigned to that space
            gameState.piecesColor[spaceNumber] = gameState.turn;

            //move the attacked piece to jail
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

       //if moving to an empty space
       else if (gameState.pieces[spaceNumber] === 0) {
            gameState.pieces[spaceNumber] += 1;
            gameState.piecesColor[spaceNumber] = gameState.turn;
       }

       //if moving to a space which already has pieces of the same color
       else {
            gameState.pieces[spaceNumber] += 1;
       }

       this.clearGreenSquares(ctrl);
       
       //if the player had 1 or 2 moves left:
       if (gameState.numberRolls < 3) {
         Math.abs(spaceNumber - this.pieceToMove) === gameState.roll[0] ?
           gameState.roll[0] = 0 : gameState.roll[1] = 0;
       }
       //if the player rolled doubles and still had 3 or 4 moves left
       else {
          gameState.numberRolls-- ;
       }

       //if the piece was being moved out of jail
       if (gameState.turn === "blue" && gameState.bluePiecesInJail > 0) {
          gameState.bluePiecesInJail-- ;
       }
       else if (gameState.turn === "green" && gameState.greenPiecesInJail > 0) {
          gameState.greenPiecesInJail-- ;
       }

       //if the piece was moved into the home base
       if (gameState.turn === "green" && this.pieceToMove < 18 && spaceNumber >= 18) {
          gameState.greenHomeNumber++;
       }
       else if (gameState.turn === "blue" && this.pieceToMove > 5 && spaceNumber <= 5) {
          gameState.blueHomeNumber++;
       }

       //if the player has no remaining moves
       if (!gameState.roll[0] && !gameState.roll[1]) {
          this.changeTurn(gameState);
       }

       ctrl.saveGame();

    },

    moveOffBoard : function(color, ctrl, gameState) {

      this.removePieceFromCurrentSpace(ctrl, gameState)
      var difference;//the distance the piece moved to leave the board

      if (color === "blue") {
        gameState.blueScore++;
        difference = Math.abs(- 1 - this.pieceToMove);
      }
      else if (color === "green") {
        gameState.greenScore++;
        difference = 24 - this.pieceToMove;
      }

      //if player had 1 or 2 moves left
      if (gameState.numberRolls < 3) {

        //if roll 1 or roll 2 was exactly the amount needed to leave the board 
        if (difference === gameState.roll[0]){
            gameState.roll[0] = 0;
        }
        else if (difference === gameState.roll[1]){
            gameState.roll[1] = 0;
        }
        //////////////////////////////////////////////////////////////////////
        // if a roll was used that was in excess of what was needed (for instance, 
        // a 6 being used to move a piece 3 spaces to leave the board)
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
      //if player rolled doubles, and had 3 or 4 moves left
      else {
          gameState.numberRolls-- ;
      }

      this.clearGreenSquares(ctrl);

      if (!gameState.roll[0] && !gameState.roll[1]) {
        this.changeTurn(gameState);
      }
      
      ctrl.saveGame();    
    
    },

    removePieceFromCurrentSpace : function(ctrl, gameState) {
       //remove the this.pieceToMove from its current space
       gameState.pieces[this.pieceToMove] -= 1;
       //if there are no more pieces remaining on that space,
       //remove the color assigned to that space
       if (gameState.pieces[this.pieceToMove] === 0) {
           gameState.piecesColor[this.pieceToMove] = 0;
       }

    },

    manualChangeTurn : function(ctrl, gameState) {
       this.changeTurn(gameState);
       gameState.roll[0] = 0;
       gameState.roll[1] = 0;
       gameState.numberRolls = 2;
       this.clearGreenSquares(ctrl);
       ctrl.saveGame();
    },

    changeTurn : function(gameState) {
      gameState.turn === "green" ? gameState.turn = "blue" :
      gameState.turn = "green";
      gameState.showRollButton = true;
    },

    clearGreenSquares : function(ctrl) {
      for (var i = 0; i < ctrl.possibleMove.length; i++) {
        ctrl.possibleMove[i] = 0;
      }

      ctrl.showOffBoardGreen = false;
      ctrl.showOffBoardBlue = false;
    }

   };
});