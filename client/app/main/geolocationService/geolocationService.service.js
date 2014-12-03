'use strict';

angular.module('roomApp')
  .factory('geolocationService', function ($q) {

    return {
      getLocation: function () {
        var deferred = $q.defer();
        var geoData = {}
        navigator.geolocation.getCurrentPosition(function(position) {
          geoData.geoLocated = true;
          geoData.lat = position.coords.latitude;
          geoData.lon = position.coords.longitude;
          deferred.resolve(geoData);
        }, 
          function(error) {
            var errorMsg;
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMsg = "User denied the request for Geolocation."
                break;
              case error.POSITION_UNAVAILABLE:
                errorMsg = "Location information is unavailable."
                break;
              case error.TIMEOUT:
                errorMsg = "The request to get user location timed out."
                break;
              case error.UNKNOWN_ERROR:
                errorMsg = "An unknown error occurred."
                break;
            }
          deferred.reject(errorMsg)  
        });





        return deferred.promise;
      },
      makeGeoRoomName: function(geoData) {
        var geoRoom = 'geoRoom';
        var latString = String(geoData.lat);
        var lonString = String(geoData.lon);
        var firstThreeLatNumbers;
        var firstThreeLonNumbers;
        if (latString[0] === "-") {
          firstThreeLatNumbers = latString.slice(1,3) + latString.slice(4,5);
        }
        else {
          firstThreeLatNumbers = latString.slice(0,2) + latString.slice(3,4);
        }
        if (lonString[0] === "-") {
          firstThreeLonNumbers = lonString.slice(1,3) + lonString.slice(4,5);
        }
        else {
          firstThreeLonNumbers = lonString.slice(0,2) + lonString.slice(3,4);
        }
        return geoRoom + firstThreeLatNumbers + firstThreeLonNumbers;
      }
    };
  });
