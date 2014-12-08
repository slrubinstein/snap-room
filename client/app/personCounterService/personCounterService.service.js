'use strict';

angular.module('roomApp')
  .factory('personCounterService', function (socket) {

    var numberPeople;

    var namesOfPeople = {};

    var listen = function(ctrl, $scope) {
        socket.socket.on('countPeople', function(numberPeople, name) {
          ctrl.numberPeople = numberPeople;
          namesOfPeople[name] = true;
          ctrl.namesOfPeople = namesOfPeople;
          $scope.$apply();
        });
    };

    return {
      listen: listen,
      numberPeople: numberPeople
    };
  });
