'use strict';

angular.module('roomApp')
  .factory('roomService', function ($q, $http, $location, personCounterService) {
 
    return {
      get: function (roomNumber, type) {
        var deferred = $q.defer();
        var room = {};
        console.log("here");
        if (type === 'lunch') {
          console.log("here2");
          $http.get("/api/lunchRoom/" + roomNumber)
           .success(function(data){
            console.log("data: ", data)
            room = data.room;
            room.choices = data.choices;
            deferred.resolve(room); 
          }).error(function(data){
             $location.path("/");
          });

          return deferred.promise;
        }
        else {
          $http.get("/api/room/" + roomNumber)
           .success(function(data){
            room = data;
            deferred.resolve(room); 
          }).error(function(data){
             $location.path("/");
          });

          return deferred.promise;  
        }
      

      },

      submitInput: function(roomNumber, name, picture, type) {
        if (type === 'lunch') {
          $http.put("/api/lunchRoom/" + roomNumber, 
            {choice : inputForm.textInput.value,
              name : name})
            .success(function(data){
              console.log("returned from update: " , data);
          })
          .error(function(data){
              console.log("error");
          });
        }
        else if (type === 'chat') {
          $http.put('api/chat/' + roomNumber,
            {message: inputForm.textInput.value,
              name: name,
              picture: picture})
          .success(function(data) {
          })
          .error(function(data) {
            console.log('error');
          });
        }
      },

      submitVote: function(roomNumber, choice, upOrDown, name) {
        $http.put("/api/lunchRoom/" + roomNumber, 
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
















