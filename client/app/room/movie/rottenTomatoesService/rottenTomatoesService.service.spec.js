'use strict';

describe('Service: rottenTomatoesService', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var rottenTomatoesService;
  beforeEach(inject(function (_rottenTomatoesService_) {
    rottenTomatoesService = _rottenTomatoesService_;
  }));

  it('should do something', function () {
    expect(!!rottenTomatoesService).toBe(true);
  });

});
