'use strict';

angular.module('roomApp')
  .factory('personCounterService', function (socket) {

    var numberPeople;

    var namesOfPeople = [];

    var listen = function(ctrl, $scope) {
        socket.socket.on('countPeople', function(numberPeople, nameArray, leaving) {
          ctrl.numberPeople = numberPeople;
          namesOfPeople = nameArray;
          ctrl.namesOfPeople = nameArray;
          $scope.$apply();
        });
    };

    return {
      listen: listen,
      numberPeople: numberPeople
    };
  });
