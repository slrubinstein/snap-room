'use strict';

describe('Controller: LunchroomCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var LunchroomCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LunchroomCtrl = $controller('LunchroomCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
