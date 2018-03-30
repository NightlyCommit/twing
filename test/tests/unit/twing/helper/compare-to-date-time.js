const compareDateTime = require('../../../../../lib/twing/helper/compare-to-date-time').compareToDateTime;

const tap = require('tap');
const luxon = require('luxon');

tap.test('compare-to-date-time', function (test) {
    test.test('should conform to PHP loose comparisons rules', function (test) {
        test.equal(compareDateTime(luxon.DateTime.local(), 1), false, '(DateTime == 1) === false');

        test.end();
    });

    test.end();
});
