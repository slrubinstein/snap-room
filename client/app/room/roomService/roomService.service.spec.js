'use strict';

describe('Service: roomService', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var roomService;
  beforeEach(inject(function (_roomService_) {
    roomService = _roomService_;
  }));

  it('should do something', function () {
    expect(!!roomService).toBe(true);
  });

});
