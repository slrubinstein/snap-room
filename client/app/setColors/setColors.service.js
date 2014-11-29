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

    var blueRoom = {
      wall: '#8DADF9',
      trim: '#2E4272',
      accent: '#010204'
    }

    var greenRoom = {
      wall: '#87FC81',
      trim: '#328A2E',
      accent: '#144711'      
    }

    return {
      set: function (color) {
        
        switch(color) {
          case 'red':
            colorScheme.wallColor = redRoom.wall;
            colorScheme.trimColor = redRoom.trim;
            colorScheme.accentColor = redRoom.accent;
            break;
          case 'blue':
            colorScheme.wallColor = blueRoom.wall;
            colorScheme.trimColor = blueRoom.trim;
            colorScheme.accentColor = blueRoom.accent;
            break;
          case 'green':
            colorScheme.wallColor = greenRoom.wall;
            colorScheme.trimColor = greenRoom.trim;
            colorScheme.accentColor = greenRoom.accent;
            break;
        }
        console.log('checking color scheme obj', colorScheme)

        return colorScheme;
      }
    };
  });
