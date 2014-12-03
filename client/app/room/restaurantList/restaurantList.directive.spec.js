'use strict';

describe('Directive: restaurantList', function () {

  // load the directive's module and view
  beforeEach(module('roomApp'));
  beforeEach(module('app/room/restaurantList/restaurantList.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<restaurant-list></restaurant-list>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the restaurantList directive');
  }));
});