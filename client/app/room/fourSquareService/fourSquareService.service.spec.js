'use strict';

describe('Service: fourSquareService', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var fourSquareService;
  beforeEach(inject(function (_fourSquareService_) {
    fourSquareService = _fourSquareService_;
  }));

  it('should do something', function () {
    expect(!!fourSquareService).toBe(true);
  });

});
