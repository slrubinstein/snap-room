'use strict';

angular.module('roomApp')
  .factory('roomService', function ($http, $q, $location) {
    // AngularJS will instantiate a singleton by calling "new" on this function
 
  return {
    get: function (roomId) {
      var deferred = $q.defer();
      var room = {};
      $http.get("/api/room/" + roomId)
       .success(function(data){
        deferred.resolve(data); 
      }).error(function(data){
         $location.path("/");
      });


      return deferred.promise;

    },
  }
});
