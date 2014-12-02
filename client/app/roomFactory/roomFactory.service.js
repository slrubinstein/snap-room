'use strict';

angular.module('roomApp')
  .factory('roomFactory', function ($q, $http, $location) {
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
          roomData.lockedRoom = data.lock;
          roomData.type = data.type;
          roomData.roomName = data.roomName;
          deferred.resolve(roomData); 
        }).error(function(data){
           $location.path("/");
        });

        return deferred.promise;
      },

     submitInput : function(roomNumber, name, type) {
      if (type === 'lunch') {
        $http.put("/api/room/" + roomNumber, 
          {choice : chatForm.textInput.value,
            name : name})
        .success(function(data){
            // console.log(data);
        })
        .error(function(data){
            console.log("error");
        });
      }
      else if (type === 'chat') {
        $http.put('api/chat/' + roomNumber,
          {message: chatForm.textInput.value,
            name: name})
        .success(function(data) {
          // console.log(data)
        })
        .error(function(data) {
          console.log('error');
        });
      }
     },

      submitVote : function(roomNumber, choice, upOrDown, name) {
        $http.put("/api/room/" + roomNumber, 
          {choice : choice,
            name: name,
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
















