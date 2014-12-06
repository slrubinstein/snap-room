'use strict';

describe('Service: splitcheckService', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var splitcheckService;
  beforeEach(inject(function (_splitcheckService_) {
    splitcheckService = _splitcheckService_;
  }));

  it('should do something', function () {
    expect(!!splitcheckService).toBe(true);
  });

});
