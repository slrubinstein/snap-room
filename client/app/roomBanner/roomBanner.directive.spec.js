'use strict';

describe('Directive: roomBanner', function () {

  // load the directive's module and view
  beforeEach(module('roomApp'));
  beforeEach(module('app/roomBanner/roomBanner.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<room-banner></room-banner>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the roomBanner directive');
  }));
});