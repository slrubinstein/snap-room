'use strict';

/**
 * @ngdoc service
 * @name roomApp.timerFactory
 * @description
 * # timerFactory
 * Factory in the roomApp.
 */
angular.module('roomApp')
  .factory('timerFactory', function ($interval, socket) {
    

    return {
      timer: '',
      timerListener: function() {
        var self = this;
        socket.socket.on('startTimer', function(room, timer) {
          self.timer = timer;
          var countDown = $interval(function() {
            self.timer--;
            socket.socket.emit('timerDecrement', room, self.timer)
            if(self.timer === 0) {
              $interval.cancel(countDown);
              socket.socket.emit('timeUp', room);
            }
          }, 1000);
        });
      }
    };
  });
