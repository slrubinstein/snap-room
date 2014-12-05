'use strict';

describe('Controller: BackgammonCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var BackgammonCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BackgammonCtrl = $controller('BackgammonCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
