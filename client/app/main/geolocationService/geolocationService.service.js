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
        var latToThousandthPlace =  latString.slice(0, latString.indexOf(".") + 4);
        var lonToThousandthPlace = lonString.slice(0, lonString.indexOf(".") + 4);
        var latLonArr = [];

        var northernLat = String((Number(latToThousandthPlace) + .001).toFixed(3));
        var southernLat = String((Number(latToThousandthPlace) - .001).toFixed(3));
        var easternLon = String((Number(lonToThousandthPlace) + .001).toFixed(3));
        var westernLon = String((Number(lonToThousandthPlace) - .001).toFixed(3));

        latLonArr.push(latToThousandthPlace + lonToThousandthPlace);

        latLonArr.push(northernLat + westernLon);

        latLonArr.push(northernLat + lonToThousandthPlace);

        latLonArr.push(northernLat + easternLon);

        latLonArr.push(latToThousandthPlace + westernLon);

        latLonArr.push(latToThousandthPlace + easternLon);

        latLonArr.push(southernLat + westernLon);

        latLonArr.push(southernLat + lonToThousandthPlace);

        latLonArr.push(southernLat + easternLon);

        return latLonArr;

      }
    };
  });
