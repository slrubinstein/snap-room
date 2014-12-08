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
      makeGeoRoomArr: function(geoData) {
        var latString = String(geoData.lat);
        var lonString = String(geoData.lon);
        var latToHundrethPlace =  latString.slice(0, latString.indexOf(".") + 3);
        var lonToHundrethPlace = lonString.slice(0, lonString.indexOf(".") + 3);
        var latLonArr = [];

        var northernLat = String((Number(latToHundrethPlace) + .01).toFixed(2));
        var southernLat = String((Number(latToHundrethPlace) - .01).toFixed(2));
        var easternLon = String((Number(lonToHundrethPlace) + .01).toFixed(2));
        var westernLon = String((Number(lonToHundrethPlace) - .01).toFixed(2));

        latLonArr.push(latToHundrethPlace + lonToHundrethPlace);

        latLonArr.push(northernLat + westernLon);

        latLonArr.push(northernLat + lonToHundrethPlace);

        latLonArr.push(northernLat + easternLon);

        latLonArr.push(latToHundrethPlace + westernLon);

        latLonArr.push(latToHundrethPlace + easternLon);

        latLonArr.push(southernLat + westernLon);

        latLonArr.push(southernLat + lonToHundrethPlace);

        latLonArr.push(southernLat + easternLon);

        return latLonArr;

      }
    };
  });
