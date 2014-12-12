'use strict';

angular.module('roomApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('movie', {
        url: '/movie',
        templateUrl: 'app/room/movie/movie.html',
        controller: 'MovieCtrl'
      });
  });