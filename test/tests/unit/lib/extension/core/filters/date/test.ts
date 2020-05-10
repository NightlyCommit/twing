import {MockEnvironment} from "../../../../../../../mock/environment";
import {MockTemplate} from "../../../../../../../mock/template";
import {MockLoader} from "../../../../../../../mock/loader";
import * as tape from "tape";
import {date as dateFilter} from "../../../../../../../../src/lib/extension/core/filters/date";
import {DateTime} from "luxon";

const Luxon = require('luxon');

tape('date', async (test) => {
    Luxon.Settings.defaultZoneName = 'UTC';

    let env = new MockEnvironment(new MockLoader());
    let template = new MockTemplate(env);

    let date: DateTime = Luxon.DateTime.fromObject({
        year: 2001,
        hour: 12
    });

    test.same(await dateFilter(template, date), 'January 1, 2001 12:00');
    test.looseEqual(await dateFilter(template, date, 'U'), (date.toJSDate().getTime() / 1000));
    test.same(await dateFilter(template, date, 'j-U'), '1-' + (date.toJSDate().getTime() / 1000));

    /************/
    /* duration */
    /************/
    let duration;

    // default format
    duration = Luxon.Duration.fromObject({days: 1}); // 1 day exactly

    test.same(await dateFilter(template, duration), '1 days', 'should use the default format');

    // microseconds
    duration = Luxon.Duration.fromObject({milliseconds: 2}); // +2000 microseconds exactly

    test.same(await dateFilter(template, duration, '%F microseconds'), '002000 microseconds');
    test.same(await dateFilter(template, duration, '%f microseconds'), '2000 microseconds');

    // seconds
    duration = Luxon.Duration.fromObject({seconds: 2}); // 2 seconds exactly

    test.same(await dateFilter(template, duration, '%S seconds'), '02 seconds');
    test.same(await dateFilter(template, duration, '%s seconds'), '2 seconds');

    duration = Luxon.Duration.fromObject({seconds: 2, milliseconds: 6}); // 2 seconds and 6 milliseconds

    test.same(await dateFilter(template, duration, '%S seconds'), '02 seconds');
    test.same(await dateFilter(template, duration, '%s seconds'), '2 seconds');

    // minutes
    duration = Luxon.Duration.fromObject({minutes: 2}); // 2 minutes exactly

    test.same(await dateFilter(template, duration, '%I minutes'), '02 minutes');
    test.same(await dateFilter(template, duration, '%i minutes'), '2 minutes');

    duration = Luxon.Duration.fromObject({minutes: 2, seconds: 6}); // 2 minutes and 6 seconds

    test.same(await dateFilter(template, duration, '%I minutes'), '02 minutes');
    test.same(await dateFilter(template, duration, '%i minutes'), '2 minutes');

    // hours
    duration = Luxon.Duration.fromObject({hours: 2}); // 2 hours exactly

    test.same(await dateFilter(template, duration, '%H hours'), '02 hours');
    test.same(await dateFilter(template, duration, '%h hours'), '2 hours');

    duration = Luxon.Duration.fromObject({hours: 2, minutes: 6}); // 2 hours and 6 minutes

    test.same(await dateFilter(template, duration, '%H hours'), '02 hours');
    test.same(await dateFilter(template, duration, '%h hours'), '2 hours');

    // days
    duration = Luxon.Duration.fromObject({days: 2}); // 2 days exactly

    test.same(await dateFilter(template, duration, '%D days'), '02 days');
    test.same(await dateFilter(template, duration, '%a days'), '2 days');
    test.same(await dateFilter(template, duration, '%d days'), '2 days');

    duration = Luxon.Duration.fromObject({days: 2, hours: 6}); // 2 days and 6 hours

    test.same(await dateFilter(template, duration, '%D days'), '02 days');
    test.same(await dateFilter(template, duration, '%R%D days'), '+02 days', 'should format positive duration with a sign when using %R');
    test.same(await dateFilter(template, duration, '%r%D days'), '02 days', 'should format negative duration without a sign when using %r');
    test.same(await dateFilter(template, duration, '%a days'), '2 days');
    test.same(await dateFilter(template, duration, '%d days'), '2 days');

    duration = Luxon.Duration.fromObject({days: -2}); // -2 days exactly

    test.same(await dateFilter(template, duration, '%D days'), '02 days', 'should format negative duration without a sign by default');
    test.same(await dateFilter(template, duration, '%R%D days'), '-02 days', 'should format negative duration with a sign when using %R');
    test.same(await dateFilter(template, duration, '%r%D days'), '-02 days', 'should format negative duration with a sign when using %r');

    // months
    duration = Luxon.Duration.fromObject({months: 2}); // 2 months exactly

    test.same(await dateFilter(template, duration, '%M months'), '02 months');
    test.same(await dateFilter(template, duration, '%m months'), '2 months');

    duration = Luxon.Duration.fromObject({months: 2, days: 6}); // 2 months and 6 days

    test.same(await dateFilter(template, duration, '%M months'), '02 months');
    test.same(await dateFilter(template, duration, '%m months'), '2 months');

    // years
    duration = Luxon.Duration.fromObject({years: 2}); // 2 years exactly

    test.same(await dateFilter(template, duration, '%Y years'), '02 years');
    test.same(await dateFilter(template, duration, '%y years'), '2 years');

    duration = Luxon.Duration.fromObject({years: 2, months: 6}); // 2 years and 6 months

    test.same(await dateFilter(template, duration, '%Y years'), '02 years');
    test.same(await dateFilter(template, duration, '%y years'), '2 years');

    // years
    duration = Luxon.Duration.fromObject({years: 2, months: 6}); // 2 years and 6 months

    test.same(await dateFilter(template, duration, '%Y years and %M months'), '02 years and 06 months');

    test.end();
});
