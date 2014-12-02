'use strict';

angular.module('roomApp')
  .factory('setColors', function () {

    var colorScheme = {
        wallColor: null,
        trimColor: null,
        accentColor: null
      }

    var redRoom = {
      wall: '#D46A6A',
      trim: '#801515',
      accent: '#FFAAAA'
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

        return colorScheme;
      }
    };
  });
