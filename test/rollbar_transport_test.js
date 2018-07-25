const assert = require('assert');
const { LEVEL, MESSAGE } = require('triple-beam');
const { Rollbar } = require('../lib/rollbar_transport');

let instance;

beforeEach(function () {
  instance = new Rollbar({
    rollbarConfig: {
      accessToken: 'replace_to_test'
    }
  });
});

describe('.log()', function () {
  
  it('should be present', function () {
    assert.ok(instance.log);
    assert.equal('function', typeof instance.log);
  });

  it('(with no callback) should return true', function () {
    let info = {
      level: 'debug',
      message: 'foo'
    };

    info[LEVEL] = info.level;
    info[MESSAGE] = JSON.stringify(info);
    let result = instance.log(info);
    assert(true, result);
  });

  it('(with callback) should return true', function (done) {
    let info = {
      level: 'debug',
      message: 'foo'
    };

    info[LEVEL] = info.level;
    info[MESSAGE] = JSON.stringify(info);
    let result = instance.log(info, function () {
      assert(true, result);
      done();
    });
  });

});

describe('events', function () {
  it('should emit the "logged" event', function (done) {
    instance.once('logged', function (info) {
      done();
    });

    var info = {
      level: 'debug',
      message: 'foo'
    };

    info[LEVEL] = info.level;
    info[MESSAGE] = JSON.stringify(info);
    instance.log(info);
  });
});