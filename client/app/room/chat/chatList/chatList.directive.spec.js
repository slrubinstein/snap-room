'use strict';

describe('Directive: chatList', function () {

  // load the directive's module and view
  beforeEach(module('roomApp'));
  beforeEach(module('app/room/chat/chatList/chatList.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chat-list></chat-list>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the chatList directive');
  }));
});