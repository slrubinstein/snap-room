'use strict';

describe('Filter: timeFormat', function () {

  // load the filter's module
  beforeEach(module('roomApp'));

  // initialize a new instance of the filter before each test
  var timeFormat;
  beforeEach(inject(function ($filter) {
    timeFormat = $filter('timeFormat');
  }));

  it('should return the input prefixed with "timeFormat filter:"', function () {
    var text = 'angularjs';
    expect(timeFormat(text)).toBe('timeFormat filter: ' + text);
  });

});
