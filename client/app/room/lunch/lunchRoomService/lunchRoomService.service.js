'use strict';

angular.module('roomApp')
  .factory('lunchRoomService', function ($q, $http, $location, 
                                    personCounterService, socket) {
 
    return {
      get: function (roomId) {
        var deferred = $q.defer();
        var room = {};
          $http.get("/api/lunchRoom/" + roomId)
           .success(function(data){
            room = data.room;
            room.choices = data.choices;
            deferred.resolve(room); 
          }).error(function(data){
             $location.path("/");
          });

          return deferred.promise;

      },

      submitInput: function(input, roomId, name) {
        return $http.put("/api/lunchRoom/" + roomId, 
                         {choice : input,
                            name : name})
      },

      submitVote: function(roomId, choice, upOrDown, name) {
        return $http.put("/api/lunchRoom/" + roomId, 
                         {choice : choice,
                             name: name,
                        upOrDown: upOrDown})
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
      },

        listen: function(roomId, $scope, ctrl, user) {
          socket.socket.on('updateRoom', function(eventRoomId, data) {
            if (data.event==='timeUp') {
              //in case the user is in multiple rooms (which is not supposed to happen)
              if (eventRoomId === roomId) {
                $http.get("/api/lunchRoom/" + roomId)
                  .success(function(room){
                    var winner;
                    var maxVotes;
                    if (room.choices) {
                      if (room.choices.length > 0) {
                        winner = [room.choices[0].choice];
                        maxVotes = room.choices[0].votes;
                        for (var i = 0; i < room.choices.length; i++) {
                          if (room.choices[i].votes > maxVotes) {
                            winner[0] = room.choices[i].choice;
                            maxVotes = room.choices[i].votes;
                          }
                          else if (room.choices[i].votes === maxVotes
                                  && room.choices[i].choice !== winner[0]) {
                            winner.push(room.choices[i].choice);
                          }
                        }
                      ctrl.winner = winner
                      ctrl.maxVotes = maxVotes
                      }
                    }
                  })
              }
            }
            if (data.event==='vote') {
            //in case the user is in multiple rooms (which is not supposed to happen)
             if (eventRoomId === roomId) {
               if (!data.doc) return;
               if (ctrl.roomData && data.doc.data) {
                 console.log(data.doc.data)
                if (ctrl.roomData.choices && data.doc.data.choices) {
                  if (ctrl.roomData.choices.length !== data.doc.data.choices.length) {
                    ctrl.roomData.choices.push(data.doc.data.choices[data.doc.data.choices.length-1]);
                    $scope.$apply();
                  }
                  else {
                    data.doc.data.choices.forEach(function(el, index) {
                      if (el.votes !== ctrl.roomData.choices[index].votes) {
                         ctrl.roomData.choices[index].votes = el.votes;
                         ctrl.roomData.choices[index].voters = el.voters;
                      }
                      else {
                        data.doc.data.choices.forEach(function(el, index) {
                          if (el.votes !== ctrl.roomData.choices[index].votes) {
                             ctrl.roomData.choices[index].votes = el.votes;
                             ctrl.roomData.choices[index].voters = el.voters;
                          }
                        });
                      }
                    });
                  }
                }
              }
            }
          }
        })
      }
    }
});
















