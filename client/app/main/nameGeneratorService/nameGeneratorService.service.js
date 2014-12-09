'use strict';

angular.module('roomApp')
  .factory('nameGeneratorService', function () {

var animals = 'Albatross Bird Dingo Elephant Emu Falcon Jaguar Lobster Tiger Zorse'.split(' ');
console.log(animals)
var randomAnimalIndex = Math.floor(Math.random() * animals.length)
console.log(randomAnimalIndex)
var randomColors = 'Blue Red Orange Green Yellow Fuscia'.split(' ')
console.log(randomColors)
var randomColorIndex = Math.floor(Math.random() * randomColors.length);
console.log(randomColorIndex)
var generateName = function() {

  return randomColors[randomColorIndex] +
                    animals[randomAnimalIndex] +
                    Math.floor(Math.random() * 100);

}



    return {
      getName: function () {
        return generateName();
      }
    };
  });


