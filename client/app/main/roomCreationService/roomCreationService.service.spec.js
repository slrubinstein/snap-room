'use strict';

describe('Service: roomCreationService', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var roomCreationService;
  beforeEach(inject(function (_roomCreationService_) {
    roomCreationService = _roomCreationService_;
  }));

  it('should do something', function () {
    expect(!!roomCreationService).toBe(true);
  });

});
