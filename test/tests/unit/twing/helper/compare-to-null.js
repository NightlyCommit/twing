const compareNull = require('../../../../../lib/twing/helper/compare-to-null').compareToNull;

const tap = require('tap');

tap.test('compare-to-null', function (test) {
    test.test('should conform to PHP loose comparisons rules', function (test) {
        test.equal(compareNull({}), false, '(null == {}) === false');

        test.end();
    });

    test.end();
});
