'use strict';

describe('Directive: roomList', function () {

  // load the directive's module and view
  beforeEach(module('roomApp'));
  beforeEach(module('app/main/roomList/roomList.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<room-list></room-list>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the roomList directive');
  }));
});