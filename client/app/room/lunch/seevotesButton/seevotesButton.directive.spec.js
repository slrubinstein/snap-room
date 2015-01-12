'use strict';

describe('Directive: seevotesButton', function () {

  // load the directive's module
  beforeEach(module('roomApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<seevotes-button></seevotes-button>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the seevotesButton directive');
  }));
});