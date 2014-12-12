'use strict';

describe('Directive: rottenTomatoes', function () {

  // load the directive's module and view
  beforeEach(module('roomApp'));
  beforeEach(module('app/room/movie/rottenTomatoes/rottenTomatoes.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<rotten-tomatoes></rotten-tomatoes>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the rottenTomatoes directive');
  }));
});