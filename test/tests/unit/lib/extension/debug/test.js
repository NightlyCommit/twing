const {twingVarDump} = require("../../../../../../build/lib/extension/debug");
const {TwingEnvironment} = require("../../../../../../build/index");

const tap = require('tape');

tap.test('extension/debug', function (test) {
    test.test('twingVarDump', function (test) {
        test.equals(twingVarDump(new TwingEnvironment(null, {debug: false}), {}), null);

        test.end();
    });

    test.end();
});