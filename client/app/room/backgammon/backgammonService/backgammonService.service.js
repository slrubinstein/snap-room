'use strict';

angular.module('roomApp')
  .factory('backgammonService', function ($http) {

    return {
      create : function(roomId) {
      
      return  $http.post("/api/backgammonRoom", {
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
    },

    save : function(roomId, gameState) {
      return $http.put("/api/backgammonRoom/" + roomId, gameState)
    },

    get : function(roomId) {
      return $http.get("/api/backgammonRoom/" + roomId)
    }

   }
  
  });
