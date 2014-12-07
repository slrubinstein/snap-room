'use strict';

describe('Service: personCounterService', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var personCounterService;
  beforeEach(inject(function (_personCounterService_) {
    personCounterService = _personCounterService_;
  }));

  it('should do something', function () {
    expect(!!personCounterService).toBe(true);
  });

});
