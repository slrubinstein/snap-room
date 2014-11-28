'use strict';

describe('Service: getRoomData', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var getRoomData;
  beforeEach(inject(function (_getRoomData_) {
    getRoomData = _getRoomData_;
  }));

  it('should do something', function () {
    expect(!!getRoomData).toBe(true);
  });

});
