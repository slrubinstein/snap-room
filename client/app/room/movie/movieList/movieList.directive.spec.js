'use strict';

describe('Directive: movieList', function () {

  // load the directive's module and view
  beforeEach(module('roomApp'));
  beforeEach(module('app/room/movie/movieList/movieList.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<movie-list></movie-list>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the movieList directive');
  }));
});