'use strict';

angular.module('roomApp')
  .factory('personCounterService', function (socket) {

    var listen = function($scope, ctrl) {
        socket.socket.on('countPeople', function(numberPeople, nameArray) {
          ctrl.numberOfPeople = numberPeople;
          ctrl.namesOfPeople = nameArray;
          $scope.$apply();
        });
    };

    return {
      listen: listen
    };
  });
