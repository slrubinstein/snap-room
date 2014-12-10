'use strict';

angular.module('roomApp')
 .config(function ($stateProvider) {
   $stateProvider
     .state('room', {
       url: '/room/:roomNumber/:color',
       templateUrl: 'app/room/room.html',
       controller: 'RoomCtrl',
       controllerAs: 'room'
     })
     .state('room.lunch', {
       url: '/lunch',
       templateUrl: 'app/room/lunch/lunchroom.html',
       controller: 'LunchroomCtrl',
       controllerAs: 'lunch'
     })
     .state('room.chat', {
       url: '/chat',
       templateUrl: 'app/room/chat/chatroom.html',
       controller: 'ChatroomCtrl',
       controllerAs: 'chat'
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