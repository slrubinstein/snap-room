'use strict';

angular.module('roomApp')
  .factory('fourSquareService', function ($q, $http) {

    return {
      get: function(roomNumber) {
        return $http.get('/api/lunchRoom/' + roomNumber + '/vendor/foursquare')
          .then(function(resp) {
            var restaurants = resp.data.response.groups[0].items;
            return restaurants;
          })
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
