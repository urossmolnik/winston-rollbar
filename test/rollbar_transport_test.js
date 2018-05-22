const vows = require('vows');
const assert = require('assert');
const winston = require('winston');
const helpers = require('winston/test/helpers');
const Rollbar = require('../lib/rollbar_transport').Rollbar;


function assertRollbar (transport) {
    assert.instanceOf(transport, Rollbar);
    assert.isFunction(transport.log);
}

var transport = new (winston.transports.Rollbar)({ rollbarConfig: { accessToken: '8802be7c990a4922beadaaefb6e0327b' } });

vows.describe('rollbar_transport').addBatch({
    "An instance of the Rollbar Transport": {
        "should have the proper methods defined": function () {
            assertRollbar(transport);
        },
        "the log() method": helpers.testNpmLevels(transport, "should log messages to Rollbar", function (ign, err, logged) {
            if (err) throw err;
            assert.isTrue(!err);
            assert.isTrue(logged);
        })
    }
}).export(module);
