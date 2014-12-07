'use strict';

angular.module('roomApp')
  .directive('chatList', function () {
    return {
      templateUrl: 'app/room/chat/chatList/chatList.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });