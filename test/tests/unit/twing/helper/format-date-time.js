const tap = require('tap');
const luxon = require('luxon');
const formatDateTime = require('../../../../../lib/twing/helper/format-date-time').formatDateTime;

tap.test('format-date-time', function (test) {
    // console.warn()

    test.same(formatDateTime(luxon.DateTime.fromMillis(0, {zone: 'UTC'}), 'dmy'), '010170');
    test.same(formatDateTime(luxon.DateTime.fromMillis(0, {zone: 'UTC'}), 'r'), 'Thu, 01 Jan 1970 12:00:00 +0000');

    test.end();
});