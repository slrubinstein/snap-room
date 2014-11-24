'use strict';

describe('Service: timerFactory', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var timerFactory;
  beforeEach(inject(function (_timerFactory_) {
    timerFactory = _timerFactory_;
  }));

  it('should do something', function () {
    expect(!!timerFactory).toBe(true);
  });

});
