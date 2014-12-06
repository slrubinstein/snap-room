'use strict';

angular.module('roomApp')
  .factory('gameLogic', function () {
return {
  
    rollFunction : function(ctrl) {
      ctrl.roll[0] = Math.floor(Math.random() * 6 + 1);
      ctrl.roll[1] = Math.floor(Math.random() * 6 + 1);
      if (ctrl.roll[0] === ctrl.roll[1]) {
        ctrl.numberRolls = 4;
      }
      ctrl.saveGame(ctrl.roomNumber);
      ctrl.showRollButton = false;
    },

    checkSpacesFromJail : function(color) {
      if (color === "green") {
        this.pieceToMove = -1;
        var space1 = this.roll[0] - 1;
        //-1 to account for 0-indexing of spaces
        var space2 = this.roll[1] - 1;
      }
      else if (color === "blue") {
        this.pieceToMove = 24;
        var space1 = 24 - this.roll[0];
        var space2 = 24 - this.roll[1];
      }
      if (this.roll[0] !== 0 && (color === this.piecesColor[space1] || this.pieces[space1] < 2)) {
        this.possibleMove[space1] = 1; 
      }
      if (this.roll[1] !== 0 && (color === this.piecesColor[space2] || this.pieces[space2] < 2)) {
        this.possibleMove[space2] = 1; 
      }
    },

    checkOffBoardSpaces : function(color) {
      this.pieceToMove  = spaceNumber; 
    },

    moveOffBoard : function(color) {
      this.pieces[this.pieceToMove] -= 1;
      if (this.pieces[this.pieceToMove] === 0) {
           this.piecesColor[this.pieceToMove] = 0;
       }

      if (color === "blue") {
        this.blueScore++;
        var difference = Math.abs(- 1 - this.pieceToMove);
      }
      else if (color === "green") {
        this.greenScore++;
        var difference = 24 - this.pieceToMove;
      }
      if (this.numberRolls < 3) {
        console.log(difference);
        if (difference === this.roll[0]){
            this.roll[0] = 0;
        }
        else if (difference === this.roll[1]){
            this.roll[1] = 0;
        }
        else if (this.roll[0] > difference  || this.roll[1] > difference){
            if (this.roll[0] > difference  && this.roll[1] > difference) {
                this.roll[0] <= this.roll[1] ? this.roll[0] = 0 : this.roll[1] = 0;
            }
            else if (this.roll[0] > difference){
                this.roll[0] = 0;
            }
            else if (this.roll[1] > difference){
                this.roll[1] = 0;
            }
        }
      }
      else {
          this.numberRolls-- ;
      }

//at end of function
       for (var i = 0; i < this.possibleMove.length; i++) {
            this.possibleMove[i] = 0;
       }
        this.showOffBoardGreen = false;
        this.showOffBoardBlue = false;

       if (!this.roll[0] && !this.roll[1]) {
          this.turn === "green" ? this.turn = "blue" :
          this.turn = "green";
       }
/////////////       

    },

    checkSpaces : function(spaceNumber, color) {
      this.pieceToMove  = spaceNumber; 
      for (var i = 0; i < this.possibleMove.length; i++) {
        this.possibleMove[i] = 0;
      }
      this.showOffBoardGreen = false;
      this.showOffBoardBlue = false;
      if (color === "blue" && this.bluePiecesInJail === 0) {
        var space1 = spaceNumber - this.roll[0];
        var space2 = spaceNumber - this.roll[1];
      }
      else if ((color === "green" && this.greenPiecesInJail === 0)) {
        var space1 = spaceNumber + this.roll[0];
        var space2 = spaceNumber + this.roll[1];
      }

      if (this.roll[0] !== 0 && (color === this.piecesColor[space1] || this.pieces[space1] < 2)) {
        this.possibleMove[space1] = 1;
        }
      if (this.roll[1] !== 0 && (color === this.piecesColor[space2] || this.pieces[space2] < 2)) {
        this.possibleMove[space2] = 1; 
      }
      if (space1 === -1 && color === "blue" && this.blueHomeNumber === 15) {
            console.log("hello1");
            this.showOffBoardBlue = true;
        }
      else if (space1 === 24 && color === "green" && this.greenHomeNumber === 15) {
            console.log("hello2");
            this.showOffBoardGreen = true;
        }
      if (space2 === -1 && color === "blue" && this.blueHomeNumber === 15) {
            console.log("hello3");
            this.showOffBoardBlue = true;
        }
      else if (space2 === 24 && color === "green" && this.greenHomeNumber === 15) {
            console.log("hello4");
            this.showOffBoardGreen = true;
        }
      //////only if there are no pieces behind pieceToMove
      if (space1 < -1 && color === "blue" && this.blueHomeNumber === 15) {
            console.log("hello5");
            var trailingPieces = false;
            for (var i = this.pieceToMove + 1; i <= 5; i++) {
              if (this.pieces[i] > 0) {
                console.log(i);
                trailingPieces = true;
              }
            }
            if (!trailingPieces) {
              this.showOffBoardBlue = true;
            }
            trailingPieces = false;
        }
      else if (space1 > 24 && color === "green" && this.greenHomeNumber === 15) {
            console.log("hello6");
            var trailingPieces = false;
            for (var i = 18; i < this.pieceToMove; i++) {
              if (this.pieces[i] > 0) {
                console.log(i);
                trailingPieces = true;
                break;
              }
            }
            if (!trailingPieces) {
              this.showOffBoardGreen = true;
            }
            trailingPieces = false;
        }
      if (space2 < -1 && color === "blue" && this.blueHomeNumber === 15) {
            console.log("hello7");
            var trailingPieces = false;
            for (var i = this.pieceToMove + 1; i <= 5; i++) {
              if (this.pieces[i] > 0) {
                console.log(i);
                trailingPieces = true;
                break;
              }
            }
            if (!trailingPieces) {
              this.showOffBoardBlue = true;
            }
            trailingPieces = false;
        }
      else if (space2 > 24 && color === "green" && this.greenHomeNumber === 15) {
            console.log("hello8");
            var trailingPieces = false;
            for (var i = 18; i < this.pieceToMove; i++) {
              if (this.pieces[i] > 0) {
                console.log(i);
                trailingPieces = true;
                break;
              }
            }
            if (!trailingPieces) {
              this.showOffBoardGreen = true;
            }
            trailingPieces = false;
        }
    ///////
    },

    movePiece : function(spaceNumber, ctrl) {
       ctrl.pieces[ctrl.pieceToMove] -= 1;
       if (ctrl.pieces[ctrl.pieceToMove] === 0) {
           ctrl.piecesColor[ctrl.pieceToMove] = 0;
       }
       ctrl.showOffBoardGreen = false;
       ctrl.showOffBoardBlue = false;
       if (ctrl.pieces[spaceNumber] === 1 && 
          ctrl.piecesColor[spaceNumber] !== ctrl.turn) {
            ctrl.piecesColor[spaceNumber] = ctrl.turn;
            if (ctrl.turn == "blue") {
               ctrl.greenPiecesInJail++;
               if (spaceNumber >= 18) {
                  ctrl.greenHomeNumber--;
               } 
            }
            else if (ctrl.turn == "green") {
               ctrl.bluePiecesInJail++;
               if (spaceNumber <= 5) {
                   ctrl.blueHomeNumber--;
               } 
            }  
       }
       else if (ctrl.pieces[spaceNumber] === 0) {
            ctrl.pieces[spaceNumber] += 1;
            ctrl.piecesColor[spaceNumber] = ctrl.turn;
       }
       else {
            ctrl.pieces[spaceNumber] += 1;
       }
       for (var i = 0; i < ctrl.possibleMove.length; i++) {
            ctrl.possibleMove[i] = 0;
       }
       
       if (ctrl.numberRolls < 3) {
         Math.abs(spaceNumber - ctrl.pieceToMove) === ctrl.roll[0] ?
           ctrl.roll[0] = 0 : ctrl.roll[1] = 0;
       }
       else {
          ctrl.numberRolls-- ;
       }

       if (ctrl.turn === "blue" && ctrl.bluePiecesInJail > 0) {
          ctrl.bluePiecesInJail-- ;
       }

       else if (ctrl.turn === "green" && ctrl.greenPiecesInJail > 0) {
          ctrl.greenPiecesInJail-- ;
       }

       if (ctrl.turn === "green" && ctrl.pieceToMove < 18 && spaceNumber >= 18) {
           ctrl.greenHomeNumber++;
       }

       else if (ctrl.turn === "blue" && ctrl.pieceToMove > 5 && spaceNumber <= 5) {
           ctrl.blueHomeNumber++;
       }


       if (!ctrl.roll[0] && !ctrl.roll[1]) {
          ctrl.turn === "green" ? ctrl.turn = "blue" :
          ctrl.turn = "green";
          ctrl.showRollButton = true;
       }
       ctrl.saveGame(ctrl.roomNumber);
    },

    changeTurn : function(ctrl) {
      ctrl.turn === "blue" ? ctrl.turn = "green":
         ctrl.turn = "blue";
       ctrl.roll[0] = 0;
       ctrl.roll[1] = 0;
       ctrl.numberRolls = 2;
       ctrl.showOffBoardBlue = false;
       ctrl.showOffBoardGreen = false;
       for (var i = 0; i < ctrl.possibleMove.length; i++) {
         ctrl.possibleMove[i] = 0;
       }
       ctrl.saveGame(ctrl.roomNumber);
       ctrl.showRollButton = true;
    }
   };
});