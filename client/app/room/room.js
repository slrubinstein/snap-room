'use strict';

angular.module('roomApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('room', {
        url: '/room/:roomNumber/:color',
        templateUrl: 'app/room/room.html',
        controller: 'RoomCtrl',
        controllerAs: 'room'
      });
  });