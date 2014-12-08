'use strict';

angular.module('roomApp')
  .factory('personCounterService', function (socket) {

    var numberPeople;

    var listen = function(ctrl, $scope) {
        socket.socket.on('countPeople', function(numberPeople) {
          ctrl.numberPeople = numberPeople;
          $scope.$apply();
        });
    }

    return {
      listen: listen,
      numberPeople: numberPeople
    };
  });
