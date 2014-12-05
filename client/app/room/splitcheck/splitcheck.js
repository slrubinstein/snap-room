'use strict';

angular.module('roomApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('splitcheck', {
        url: '/splitcheck',
        templateUrl: 'app/room/splitcheck/splitcheck.html',
        controller: 'SplitcheckCtrl',
        controllerAs: 'split'
      });
  });