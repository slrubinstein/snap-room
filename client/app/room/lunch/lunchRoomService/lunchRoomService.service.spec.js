'use strict';

describe('Service: lunchRoomService', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var lunchRoomService;
  beforeEach(inject(function (_lunchRoomService_) {
    lunchRoomService = _lunchRoomService_;
  }));

  it('should do something', function () {
    expect(!!lunchRoomService).toBe(true);
  });

});
