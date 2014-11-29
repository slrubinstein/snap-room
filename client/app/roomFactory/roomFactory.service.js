'use strict';

angular.module('roomApp')
  .factory('roomFactory', function ($q, $http) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      get: function (roomNumber) {
        var deferred = $q.defer();
        var roomData = {};
        $http.get("/api/room/" + roomNumber)
         .success(function(data){
          roomData.initialRoomData = data;
          roomData.roomColor = data.color;
          roomData.expiresAt = new Date(Date.parse(data.ourExpTime));
          deferred.resolve(roomData); 
        }).error(function(data){
           //deferred.reject(data)?
        });

        return deferred.promise;
      },

     submitInput : function(roomNumber) {
        $http.put("/api/room/" + roomNumber, 
          {choice : chatForm.textInput.value})
        .success(function(data){
            // console.log(data);
        })
        .error(function(data){
            console.log("error");
        });
     },

      submitVote : function(roomNumber, choice, upOrDown) {
        $http.put("/api/room/" + roomNumber, 
          {choice : choice,
            upOrDown: upOrDown})
          .success(function(data){
          })
          .error(function(data){
              console.log("error");
          });
      },

      getFourSquare : function(roomNumber) {
          var deferred = $q.defer();
          var restaurants;
          $http.get('/api/room/' + roomNumber + '/vendor/foursquare')
            .success(function(data) {
              restaurants = data.response.groups[0].items;
              deferred.resolve(restaurants);
          })
          return deferred.promise; 
      } 
    }    
  });
















