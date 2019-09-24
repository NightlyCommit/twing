const {date} = require('../../../../../../../../build/lib/extension/core/functions/date');
const {formatDateTime} = require('../../../../../../../../build/lib/helpers/format-date-time');
const Luxon = require('luxon');
const tape = require('tape');

const {
    TwingEnvironment,
    TwingLoaderNull
} = require('../../../../../../../../build/main');

tape.test('date', function (test) {
    Luxon.Settings.defaultZoneName = 'UTC';

    let env = new TwingEnvironment(new TwingLoaderNull(), {});

    test.true(date(env, 'now') instanceof Luxon.DateTime);

    try {
        date(env, {});

        test.fail();
    }
    catch (e) {
        test.same(e.message, 'Failed to parse date "[object Object]".');
    }

    test.same(date(env, '2010-01-28T15:00:00', false).valueOf(), 1264690800000);

    let dateTime = date(env, '2010-01-28T15:00:00');

    test.same(dateTime.format('H'), formatDateTime(dateTime, 'H'));

    test.end();
});