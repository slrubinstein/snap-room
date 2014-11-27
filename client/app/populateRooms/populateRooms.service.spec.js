'use strict';

describe('Service: populateRooms', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var populateRooms;
  beforeEach(inject(function (_populateRooms_) {
    populateRooms = _populateRooms_;
  }));

  it('should do something', function () {
    expect(!!populateRooms).toBe(true);
  });

});
