'use strict';

describe('Directive: createRoomPanel', function () {

  // load the directive's module and view
  beforeEach(module('roomApp'));
  beforeEach(module('app/main/createRoomPanel/createRoomPanel.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<create-room-panel></create-room-panel>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the createRoomPanel directive');
  }));
});