'use strict';

angular.module('roomApp')
  .factory('personCounterService', function (socket) {

    var numberPeople;

    var namesOfPeople = [];

    var listen = function(ctrl, $scope) {
        socket.socket.on('countPeople', function(numberPeople, nameArray, leaving) {
          ctrl.numberPeople = numberPeople;
          console.log(numberPeople, '#')
          console.log('nameArray from socket', nameArray)
          namesOfPeople = nameArray;
          ctrl.namesOfPeople = nameArray;
          console.log(ctrl.namesOfPeople)
          $scope.$apply();
        });
    };

    return {
      listen: listen,
      numberPeople: numberPeople
    };
  });
