'use strict';

describe('Service: geolocationService', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var geolocationService;
  beforeEach(inject(function (_geolocationService_) {
    geolocationService = _geolocationService_;
  }));

  it('should do something', function () {
    expect(!!geolocationService).toBe(true);
  });

});
