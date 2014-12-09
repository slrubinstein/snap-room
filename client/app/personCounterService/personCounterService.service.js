'use strict';

angular.module('roomApp')
  .factory('personCounterService', function (socket) {

    var numberPeople;

    var namesOfPeople = {};

    var listen = function(ctrl, $scope) {
        socket.socket.on('countPeople', function(numberPeople, name, leaving) {
          ctrl.numberPeople = numberPeople;
          console.log(numberPeople, '#')
          console.log('name from socket', name)
          if (leaving && name) {
            namesOfPeople[name] = false;
          } else if (!leaving && name) {
            namesOfPeople[name] = true;
          }

          console.log(namesOfPeople)

          ctrl.namesOfPeople = namesOfPeople;
          $scope.$apply();
        });
    };

    return {
      listen: listen,
      numberPeople: numberPeople
    };
  });
