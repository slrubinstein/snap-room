'use strict';

describe('Service: setColors', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var setColors;
  beforeEach(inject(function (_setColors_) {
    setColors = _setColors_;
  }));

  it('should do something', function () {
    expect(!!setColors).toBe(true);
  });

});
