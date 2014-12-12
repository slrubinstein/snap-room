'use strict';

describe('Service: movieRoomService', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var movieRoomService;
  beforeEach(inject(function (_movieRoomService_) {
    movieRoomService = _movieRoomService_;
  }));

  it('should do something', function () {
    expect(!!movieRoomService).toBe(true);
  });

});
