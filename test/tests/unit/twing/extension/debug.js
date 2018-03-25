const twingVarDump = require("../../../../../lib/twing/extension/debug").twingVarDump;
const TwingEnvironment = require("../../../../../lib/twing/environment").TwingEnvironment;

const tap = require('tap');

tap.test('extension/debug', function (test) {
    test.test('twingVarDump', function (test) {
        test.equals(twingVarDump(new TwingEnvironment(null, {debug: false}), {}), null);

        test.end();
    });

    test.end();
});