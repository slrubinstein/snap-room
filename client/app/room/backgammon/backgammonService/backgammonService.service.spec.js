'use strict';

describe('Service: backgammonService', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var backgammonService;
  beforeEach(inject(function (_backgammonService_) {
    backgammonService = _backgammonService_;
  }));

  it('should do something', function () {
    expect(!!backgammonService).toBe(true);
  });

});
