'use strict';

angular.module('roomApp')
  .factory('setColors', function () {

    var colorScheme = {
        wallColor: null,
        trimColor: null,
        accentColor: null
      }

    var redRoom = {
      wall: '#FFAAAA',
      trim: '#AA3939',
      accent: '#550000'
    }

    return {
      set: function (color) {
        
        switch(color) {
          case 'red':
            colorScheme.wallColor = redRoom.wall;
            colorScheme.trimColor = redRoom.trim;
            colorScheme.accentColor = redRoom.accent;
            break;
        }
        console.log('checking color scheme obj', colorScheme)

        return colorScheme;
      }
    };
  });
