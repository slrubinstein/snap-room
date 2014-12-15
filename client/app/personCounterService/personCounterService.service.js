'use strict';

angular.module('roomApp')
  .factory('personCounterService', function (socket) {

    var listen = function(ctrl) {
        socket.socket.on('countPeople', function(numberPeople, nameArray) {
          ctrl.numberOfPeople = numberPeople;
          ctrl.namesOfPeople = nameArray;
        });
    };

    return {
      listen: listen
    };
  });
