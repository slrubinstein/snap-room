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

      submitInput: function(roomNumber, name, picture, type) {
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
              name: name,
              picture: picture})
          .success(function(data) {
            // console.log(data)
          })
          .error(function(data) {
            console.log('error');
          });
        }
      },

      submitVote: function(roomNumber, choice, upOrDown, name) {
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

      toggleColors: function(roomColor, event) {

        var colorClass;

          switch(roomColor) {
            case 'red':
              colorClass = 'redTrim';
              break;
            case 'blue':
              colorClass = 'blueTrim';
              break;
            case 'green':
              colorClass = 'greenTrim';
              break;
          }
          
          $(event.target).closest('.list-group-item').addClass(colorClass);
          setTimeout(function() {
            $(event.target).closest('.list-group-item').removeClass(colorClass);
          }, 100);
        }
      }    
  });
















