'use strict';

describe('Service: gameLogic', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var gameLogic;
  beforeEach(inject(function (_gameLogic_) {
    gameLogic = _gameLogic_;
  }));

  it('should do something', function () {
    expect(!!gameLogic).toBe(true);
  });

});
