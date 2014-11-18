'use strict';

angular.module('roomApp')
  .controller('RoomCtrl', function ($scope, $stateParams) {
    $scope.message = 'Hello';
    console.log($stateParams);
  });
