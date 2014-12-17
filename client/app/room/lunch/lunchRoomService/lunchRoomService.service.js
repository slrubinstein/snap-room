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
              //to prevent events in a different room 
              //from affecting this room
              if (eventRoomId !== roomId) return;

              $http.get("/api/lunchRoom/" + roomId)
                .success(function(room) {
                  if (!room.choices) return;
                  if (room.choices.length === 0) return;
                  ctrl.winner = [room.choices[0].choice];
                  ctrl.maxVotes = room.choices[0].votes;
                  for (var i = 0; i < room.choices.length; i++) {
                    if (room.choices[i].votes > ctrl.maxVotes) {
                      ctrl.winner[0] = room.choices[i].choice;
                      ctrl.maxVotes = room.choices[i].votes;
                    }
                    else if (room.choices[i].votes === ctrl.maxVotes
                            && room.choices[i].choice !== ctrl.winner[0]) {
                      ctrl.winner.push(room.choices[i].choice);
                    }
                  }
                })
                .error(function(error){

                })
            } //close "if (data.event==='timeUp')"

            if (data.event==='vote') {
              //to prevent events in a different room 
              //from affecting this room
              if (eventRoomId !== roomId) {return;}
              if (!data.doc || !ctrl.roomData || !data.doc.data 
                 ||!ctrl.roomData.choices || !data.doc.data.choices) {return;}

              updateVotes(ctrl.roomData.choices, data.doc.data.choices)

            }
          })//close 'updateRoom' listener
    
          function updateVotes(roomChoices, socketChoices) {
            //if a new restaurant has been voted on, add the new
            //restaurant to roomChoices
            if (roomChoices.length !== socketChoices.length) {
              roomChoices.push(socketChoices[socketChoices.length-1]);
            }
            //else, if more votes have been added to an already voted-on restaurant,
            //find the restaurant which has an updated vote total, and add the new
            //vote total and list of voters
            else {
              socketChoices.forEach(function(el, index) {
                if (el.votes !== roomChoices[index].votes) {
                   roomChoices[index].votes = el.votes;
                   roomChoices[index].voters = el.voters;
                }
              });
            }  
          }//close updateVotes function
      },
      seeVotes : function(event) {
        $(event.target).closest('.list-group-item').next().toggleClass('ng-hide');
      }
    }
});
















