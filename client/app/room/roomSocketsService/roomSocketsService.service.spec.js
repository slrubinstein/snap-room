'use strict';

describe('Service: roomSocketsService', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var roomSocketsService;
  beforeEach(inject(function (_roomSocketsService_) {
    roomSocketsService = _roomSocketsService_;
  }));

  it('should do something', function () {
    expect(!!roomSocketsService).toBe(true);
  });

});
