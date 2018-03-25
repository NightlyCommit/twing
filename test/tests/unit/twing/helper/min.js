const tap = require('tap');
const min = require('../../../../../lib/twing/helper/min').min;

tap.test('min', function (test) {
    test.test('supports multiple parameters', function (test) {
        test.same(min(1, 3, 2), 1);

        test.end();
    });

    test.end();
});