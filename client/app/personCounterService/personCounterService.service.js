'use strict';

angular.module('roomApp')
  .factory('personCounterService', function (socket) {

    var numberPeople;

    var namesOfPeople = [];

    var listen = function($scope) {
        socket.socket.on('countPeople', function(numberPeople, nameArray) {
          numberPeople = numberPeople;
          namesOfPeople = nameArray;
          $scope.$apply();
        });
    };

    return {
      listen: listen,
      numberPeople: numberPeople,
      namesOfPeople: namesOfPeople
    };
  });
