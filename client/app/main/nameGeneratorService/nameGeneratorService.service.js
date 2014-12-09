'use strict';

angular.module('roomApp')
  .factory('nameGeneratorService', function () {

  var animals = 'Albatross Bird Dingo Elephant Emu Falcon Jaguar Lobster Tiger Zorse'.split(' ');
  var randomColors = 'Blue Red Orange Green Yellow Fuscia'.split(' ')

  var generateName = function() {

    var randomAnimalIndex = Math.floor(Math.random() * animals.length)
    var randomColorIndex = Math.floor(Math.random() * randomColors.length);
    var randomNum = Math.floor(Math.random() * 100)

    return randomColors[randomColorIndex] +
            animals[randomAnimalIndex] +
            randomNum;
  }

    return {
      getName: function () {
        return generateName();
      }
    };
  });


