'use strict';

angular.module('roomApp')
  .factory('roomSocketsService', function (socket, Auth, usernameVal, $http) {

    return {

       listen: function(roomNumber, $scope, ctrl, user) {
        // socket.socket.on('timeUp', function(expiredRoomNumber, data) {
        //   //in case the user is in multiple rooms (which is not supposed to happen)
        //   if (Number(expiredRoomNumber) === Number(roomNumber)) {
        //     ctrl.timeUp = true
        //     ////////////////////////////////////
        //     if (ctrl.roomType === 'lunch') {
        //       ctrl.winner = data.winner;
        //       ctrl.maxVotes = data.maxVotes;
        //     }
        //     ////////////////////////////////////
        //   }
        // });

        var name = usernameVal.name;
        socket.socket.emit('join', roomNumber, name);
        
        socket.socket.on('updateRoom', function(roomNumber, data) {
          // if (data.event==='vote') {
          //   //refactor into updateVotes()
          //   console.log('ctrl', ctrl.roomData)
          //   if (ctrl.roomData && data.doc) {
          //     if (ctrl.roomData.choices.length !== data.doc.choices.length) {
          //       ctrl.roomData.choices.push(data.doc.choices[data.doc.choices.length-1]);
          //       $scope.$apply();
          //     }
          //     else {
          //       data.doc.choices.forEach(function(el, index) {
          //         if (el.votes !== ctrl.roomData.choices[index].votes) {
          //            ctrl.roomData.choices[index].votes = el.votes;
          //            ctrl.roomData.choices[index].voters = el.voters;
          //         }
          //         else {
          //           data.doc.choices.forEach(function(el, index) {
          //             if (el.votes !== ctrl.roomData.choices[index].votes) {
          //                ctrl.roomData.choices[index].votes = el.votes;
          //                ctrl.roomData.choices[index].voters = el.voters;
          //             }
          //         });
          //       }
          //      });
          //     }
          //   }
          }
          if (data.event==='chat') {
            console.log(data)
            ctrl.roomData = data.doc;
          }
          if (data.event==='timeUp') {
            //in case the user is in multiple rooms (which is not supposed to happen)
            if (Number(expiredRoomNumber) === Number(roomNumber)) {
              ctrl.timeUp = true
              ////////////////////////////////////
        //       if (ctrl.roomType === 'lunch') {
        //         $http.get("/api/lunchRoom/" + roomNumber)
        //           .success(function(room){
        //             ctrl.winner;
        //             ctrl.maxVotes;
        //             if (room.choices) {
        //               if (room.choices.length > 0) {
        //                 winner = [room.choices[0].choice];
        //                 maxVotes = room.choices[0].votes;
        //                 for (var i = 0; i < room.choices.length; i++) {
        //                   if (room.choices[i].votes > maxVotes) {
        //                     winner[0] = room.choices[i].choice;
        //                     maxVotes = room.choices[i].votes;
        //                   }
        //                   else if (room.choices[i].votes === maxVotes
        //                           && room.choices[i].choice !== winner[0]) {
        //                     winner.push(room.choices[i].choice);
        //                   }
        //                 }
        //             ctrl.winner = winner
        //             ctrl.maxVotes = maxVotes
        //       }
        //     }


        //   })
        // }

        //function updateVotes(data) {

        //}

      }
    }
  });
}
}
})