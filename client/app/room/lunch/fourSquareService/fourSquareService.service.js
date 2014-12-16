'use strict';

angular.module('roomApp')
  .factory('fourSquareService', function ($q, $http) {

    return {
      get: function(roomId) {
        return $http.get('/api/lunchRoom/' + roomId + '/vendor/foursquare')
      },
      
      show: function (event) {
        $(event.target).toggleClass('ng-hide');
        $(event.target).prev().toggleClass('ng-hide');
        $('.foursquareRests').toggleClass('ng-hide');
      },
      hide: function(event) {
        $(event.target).toggleClass('ng-hide');
        $(event.target).next().toggleClass('ng-hide');
        $('.foursquareRests').toggleClass('ng-hide');
      }
    };
  });
