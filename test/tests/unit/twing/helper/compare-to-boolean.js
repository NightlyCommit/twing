const compareBoolean = require('../../../../../lib/twing/helper/compare-to-boolean').compareToBoolean;

const tap = require('tap');

tap.test('compare-to-array', function (test) {
    test.test('should conform to PHP loose comparisons rules', function (test) {
        test.equal(compareBoolean(true, 1), true, '(true == 1) === true');
        test.equal(compareBoolean(true, {}), false, '(true == {}) === false');

        test.end();
    });

    test.end();
});
