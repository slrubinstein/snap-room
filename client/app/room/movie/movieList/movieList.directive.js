'use strict';

angular.module('roomApp')
  .directive('movieList', function () {
    return {
      templateUrl: 'app/room/movie/movieList/movieList.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });