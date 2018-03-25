const tap = require('tap');
const isCountable = require('../../../../../lib/twing/helper/is-countable').isCountable;

tap.test('is-countable', function (test) {
    test.test('supports arrays', function (test) {
        test.equals(isCountable(new Map()), true);
        test.equals(isCountable([]), true);

        test.end();
    });

    test.end();
});