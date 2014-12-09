'use strict';

describe('Service: nameGeneratorService', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var nameGeneratorService;
  beforeEach(inject(function (_nameGeneratorService_) {
    nameGeneratorService = _nameGeneratorService_;
  }));

  it('should do something', function () {
    expect(!!nameGeneratorService).toBe(true);
  });

});
