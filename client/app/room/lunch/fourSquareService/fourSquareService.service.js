'use strict';

angular.module('roomApp')
  .factory('fourSquareService', function ($q, $http) {

    return {
      get: function(roomId) {
        return $http.get('/api/lunchRoom/' + roomId + '/vendor/foursquare')
      }
      
    };
  });
