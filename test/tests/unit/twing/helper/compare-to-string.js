const compareToString = require('../../../../../lib/twing/helper/compare-to-string').compareToString;

const tap = require('tap');

tap.test('compare-to-string', function (test) {
    test.test('should conform to PHP loose comparisons rules', function (test) {
        test.equal(compareToString('foo', true), true, '(null == {}) === false');

        test.end();
    });

    test.end();
});
