'use strict';

angular.module('roomApp')
  .factory('rottenTomatoesService', function ($q, $http) {

    return {
      get: function(roomNumber) {
        return $http.get('/api/lunchRoom/' + roomNumber + '/vendor/rottenTomatoes')
          .then(function(resp) {
            var restaurants = resp.data.response.groups[0].items;
            return restaurants;
          })
      },
      show: function (event) {
        $(event.target).toggleClass('ng-hide');
        $(event.target).prev().toggleClass('ng-hide');
        $('.rottenTomatoesRests').toggleClass('ng-hide');
      },
      hide: function(event) {
        $(event.target).toggleClass('ng-hide');
        $(event.target).next().toggleClass('ng-hide');
        $('.rottenTomatoesRests').toggleClass('ng-hide');
      }
    };
  });
