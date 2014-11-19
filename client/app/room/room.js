'use strict';

angular.module('roomApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('room', {
        url: '/room/:data',
        templateUrl: 'app/room/room.html',
        controller: 'RoomCtrl',
        controllerAs: 'room'
      });
  });