const {formatDateTime} = require('../../../../../../dist');

const tap = require('tape');
const luxon = require('luxon');

tap.test('format-date-time', function (test) {
    test.same(formatDateTime(luxon.DateTime.fromMillis(0, {zone: 'UTC'}), 'dmy'), '010170');
    test.same(formatDateTime(luxon.DateTime.fromMillis(0, {zone: 'UTC'}), 'r'), 'Thu, 01 Jan 1970 12:00:00 +0000');

    test.end();
});