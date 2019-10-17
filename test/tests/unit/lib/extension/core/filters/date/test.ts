import {MockEnvironment} from "../../../../../../../mock/environment";
import {MockLoader} from "../../../../../../../mock/loader";
import * as tape from "tape";
import {date as dateFilter} from "../../../../../../../../src/lib/extension/core/filters/date";
import {DateTime} from "luxon";

const Luxon = require('luxon');

tape('date', async (test) => {
    Luxon.Settings.defaultZoneName = 'UTC';

    let env = new MockEnvironment(new MockLoader());

    let date: DateTime = Luxon.DateTime.fromObject({
        year: 2001,
        hour: 12
    });

    test.same(await dateFilter(env, date), 'January 1, 2001 12:00');
    test.looseEqual(await dateFilter(env, date, 'U'), (date.toJSDate().getTime() / 1000));
    test.same(await dateFilter(env, date, 'j-U'), '1-' + (date.toJSDate().getTime() / 1000));

    /************/
    /* duration */
    /************/
    let duration;

    // default format
    duration = Luxon.Duration.fromObject({days: 1}); // 1 day exactly

    test.same(await dateFilter(env, duration), '1 days', 'should use the default format');

    // microseconds
    duration = Luxon.Duration.fromObject({milliseconds: 2}); // +2000 microseconds exactly

    test.same(await dateFilter(env, duration, '%F microseconds'), '002000 microseconds');
    test.same(await dateFilter(env, duration, '%f microseconds'), '2000 microseconds');

    // seconds
    duration = Luxon.Duration.fromObject({seconds: 2}); // 2 seconds exactly

    test.same(await dateFilter(env, duration, '%S seconds'), '02 seconds');
    test.same(await dateFilter(env, duration, '%s seconds'), '2 seconds');

    duration = Luxon.Duration.fromObject({seconds: 2, milliseconds: 6}); // 2 seconds and 6 milliseconds

    test.same(await dateFilter(env, duration, '%S seconds'), '02 seconds');
    test.same(await dateFilter(env, duration, '%s seconds'), '2 seconds');

    // minutes
    duration = Luxon.Duration.fromObject({minutes: 2}); // 2 minutes exactly

    test.same(await dateFilter(env, duration, '%I minutes'), '02 minutes');
    test.same(await dateFilter(env, duration, '%i minutes'), '2 minutes');

    duration = Luxon.Duration.fromObject({minutes: 2, seconds: 6}); // 2 minutes and 6 seconds

    test.same(await dateFilter(env, duration, '%I minutes'), '02 minutes');
    test.same(await dateFilter(env, duration, '%i minutes'), '2 minutes');

    // hours
    duration = Luxon.Duration.fromObject({hours: 2}); // 2 hours exactly

    test.same(await dateFilter(env, duration, '%H hours'), '02 hours');
    test.same(await dateFilter(env, duration, '%h hours'), '2 hours');

    duration = Luxon.Duration.fromObject({hours: 2, minutes: 6}); // 2 hours and 6 minutes

    test.same(await dateFilter(env, duration, '%H hours'), '02 hours');
    test.same(await dateFilter(env, duration, '%h hours'), '2 hours');

    // days
    duration = Luxon.Duration.fromObject({days: 2}); // 2 days exactly

    test.same(await dateFilter(env, duration, '%D days'), '02 days');
    test.same(await dateFilter(env, duration, '%a days'), '2 days');
    test.same(await dateFilter(env, duration, '%d days'), '2 days');

    duration = Luxon.Duration.fromObject({days: 2, hours: 6}); // 2 days and 6 hours

    test.same(await dateFilter(env, duration, '%D days'), '02 days');
    test.same(await dateFilter(env, duration, '%R%D days'), '+02 days', 'should format positive duration with a sign when using %R');
    test.same(await dateFilter(env, duration, '%r%D days'), '02 days', 'should format negative duration without a sign when using %r');
    test.same(await dateFilter(env, duration, '%a days'), '2 days');
    test.same(await dateFilter(env, duration, '%d days'), '2 days');

    duration = Luxon.Duration.fromObject({days: -2}); // -2 days exactly

    test.same(await dateFilter(env, duration, '%D days'), '02 days', 'should format negative duration without a sign by default');
    test.same(await dateFilter(env, duration, '%R%D days'), '-02 days', 'should format negative duration with a sign when using %R');
    test.same(await dateFilter(env, duration, '%r%D days'), '-02 days', 'should format negative duration with a sign when using %r');

    // months
    duration = Luxon.Duration.fromObject({months: 2}); // 2 months exactly

    test.same(await dateFilter(env, duration, '%M months'), '02 months');
    test.same(await dateFilter(env, duration, '%m months'), '2 months');

    duration = Luxon.Duration.fromObject({months: 2, days: 6}); // 2 months and 6 days

    test.same(await dateFilter(env, duration, '%M months'), '02 months');
    test.same(await dateFilter(env, duration, '%m months'), '2 months');

    // years
    duration = Luxon.Duration.fromObject({years: 2}); // 2 years exactly

    test.same(await dateFilter(env, duration, '%Y years'), '02 years');
    test.same(await dateFilter(env, duration, '%y years'), '2 years');

    duration = Luxon.Duration.fromObject({years: 2, months: 6}); // 2 years and 6 months

    test.same(await dateFilter(env, duration, '%Y years'), '02 years');
    test.same(await dateFilter(env, duration, '%y years'), '2 years');

    // years
    duration = Luxon.Duration.fromObject({years: 2, months: 6}); // 2 years and 6 months

    test.same(await dateFilter(env, duration, '%Y years and %M months'), '02 years and 06 months');

    test.end();
});
