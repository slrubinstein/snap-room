'use strict';

describe('Controller: SplitcheckCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var SplitcheckCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SplitcheckCtrl = $controller('SplitcheckCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
