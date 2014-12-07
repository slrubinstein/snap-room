'use strict';

angular.module('roomApp')
  .factory('fourSquareService', function ($q, $http) {

    return {
      get: function(roomNumber) {
        var deferred = $q.defer();
        var restaurants;
        $http.get('/api/room/' + roomNumber + '/vendor/foursquare')
          .success(function(data) {
            restaurants = data.response.groups[0].items;
            deferred.resolve(restaurants);
          })
        return deferred.promise; 
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
