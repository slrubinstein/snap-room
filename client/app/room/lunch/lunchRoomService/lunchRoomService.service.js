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

      submitInput: function(roomId, name, picture) {
        $http.put("/api/lunchRoom/" + roomId, 
          {choice : inputForm.textInput.value,
            name : name})
          .success(function(data){
            socket.socket.emit('updateRoom', roomId, {event: 'vote', doc: data})
        })
        .error(function(data){
            console.log("error");
        });
      },

      submitVote: function(roomId, choice, upOrDown, name) {
        $http.put("/api/lunchRoom/" + roomId, 
          {choice : choice,
            name: name,
            upOrDown: upOrDown})
          .success(function(data){
            socket.socket.emit('updateRoom', roomId, {event: 'vote', doc: data})
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
               if (ctrl.roomData && data.doc) {
                if (ctrl.roomData.choices.length !== data.doc.choices.length) {
                  ctrl.roomData.choices.push(data.doc.choices[data.doc.choices.length-1]);
                  $scope.$apply();
                }
                else {
                  data.doc.choices.forEach(function(el, index) {
                    if (el.votes !== ctrl.roomData.choices[index].votes) {
                       ctrl.roomData.choices[index].votes = el.votes;
                       ctrl.roomData.choices[index].voters = el.voters;
                    }
                    else {
                      data.doc.choices.forEach(function(el, index) {
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
        })
      }
  }
});
















