'use strict';

angular.module('roomApp')
 .config(function ($stateProvider) {
   $stateProvider
     .state('room', {
       url: '/room/:roomNumber/:color/:geoRoom',
       templateUrl: 'app/room/room.html',
       controller: 'RoomCtrl',
       controllerAs: 'room'
     })
     .state('room.lunch', {
       url: '/lunch',
       templateUrl: 'app/room/lunchroom.html',
       controller: 'RoomCtrl',
       controllerAs: 'room'
     })
     .state('room.chat', {
       url: '/chat',
       templateUrl: 'app/room/chatroom.html',
       controller: 'RoomCtrl',
       controllerAs: 'room'
     })
     .state('room.splitcheck', {
       url: '/splitcheck',
       templateUrl: 'app/room/splitcheck/splitcheck.html',
       controller: 'SplitcheckCtrl',
       controllerAs: 'split'
     })
     .state('room.backgammon', {
       url: '/backgammon',
       templateUrl: 'app/room/backgammon/backgammon.html',
       controller: 'BackgammonCtrl',
       controllerAs: 'table'
     });
 });