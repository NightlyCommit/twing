const TwingExtensionCore = require('../../../../../lib/twing/extension/core').TwingExtensionCore;
const TwingMap = require('../../../../../lib/twing/map').TwingMap;
const TwingTestEnvironmentStub = require('../../../../mock/environment');
const TwingTestMockLoader = require('../../../../mock/loader');
const Luxon = require('luxon');

const tap = require('tap');

let getFilter = function (name) {
    let extension = new TwingExtensionCore();

    return extension.getFilters().find(function (filter) {
        return filter.getName() === name;
    });
};

tap.test('TwingExtensionCore', function (test) {
    test.test('filter', function (test) {
        test.test('date', function (test) {
            Luxon.Settings.defaultZoneName = 'UTC';

            let filter = getFilter('date');
            let callable = filter.getCallable();
            let env = new TwingTestEnvironmentStub(new TwingTestMockLoader());

            let date = Luxon.DateTime.fromObject({
                year: 2001,
                hour: 12
            });

            test.same(callable(env, date), 'January 1, 2001 12:00');
            test.same(callable(env, date, 'U'), date.toJSDate().getTime());
            test.same(callable(env, date, 'j-U'), '1-' + date.toJSDate().getTime());

            /************/
            /* duration */
            /************/
            let duration;

            // default format
            duration = Luxon.Duration.fromObject({days: 1}); // 1 day exactly

            test.same(callable(env, duration), '1 days', 'should use the default format');

            // microseconds
            duration = Luxon.Duration.fromObject({milliseconds: 2}); // +2000 microseconds exactly

            test.same(callable(env, duration, '%F microseconds'), '002000 microseconds');
            test.same(callable(env, duration, '%f microseconds'), '2000 microseconds');

            // seconds
            duration = Luxon.Duration.fromObject({seconds: 2}); // 2 seconds exactly

            test.same(callable(env, duration, '%S seconds'), '02 seconds');
            test.same(callable(env, duration, '%s seconds'), '2 seconds');

            duration = Luxon.Duration.fromObject({seconds: 2, milliseconds: 6}); // 2 seconds and 6 milliseconds

            test.same(callable(env, duration, '%S seconds'), '02 seconds');
            test.same(callable(env, duration, '%s seconds'), '2 seconds');

            // minutes
            duration = Luxon.Duration.fromObject({minutes: 2}); // 2 minutes exactly

            test.same(callable(env, duration, '%I minutes'), '02 minutes');
            test.same(callable(env, duration, '%i minutes'), '2 minutes');

            duration = Luxon.Duration.fromObject({minutes: 2, seconds: 6}); // 2 minutes and 6 seconds

            test.same(callable(env, duration, '%I minutes'), '02 minutes');
            test.same(callable(env, duration, '%i minutes'), '2 minutes');

            // hours
            duration = Luxon.Duration.fromObject({hours: 2}); // 2 hours exactly

            test.same(callable(env, duration, '%H hours'), '02 hours');
            test.same(callable(env, duration, '%h hours'), '2 hours');

            duration = Luxon.Duration.fromObject({hours: 2, minutes: 6}); // 2 hours and 6 minutes

            test.same(callable(env, duration, '%H hours'), '02 hours');
            test.same(callable(env, duration, '%h hours'), '2 hours');

            // days
            duration = Luxon.Duration.fromObject({days: 2}); // 2 days exactly

            test.same(callable(env, duration, '%D days'), '02 days');
            test.same(callable(env, duration, '%a days'), '2 days');
            test.same(callable(env, duration, '%d days'), '2 days');

            duration = Luxon.Duration.fromObject({days: 2, hours: 6}); // 2 days and 6 hours

            test.same(callable(env, duration, '%D days'), '02 days');
            test.same(callable(env, duration, '%R%D days'), '+02 days', 'should format positive duration with a sign when using %R');
            test.same(callable(env, duration, '%r%D days'), '02 days', 'should format negative duration without a sign when using %r');
            test.same(callable(env, duration, '%a days'), '2 days');
            test.same(callable(env, duration, '%d days'), '2 days');

            duration = Luxon.Duration.fromObject({days: -2}); // -2 days exactly

            test.same(callable(env, duration, '%D days'), '02 days', 'should format negative duration without a sign by default');
            test.same(callable(env, duration, '%R%D days'), '-02 days', 'should format negative duration with a sign when using %R');
            test.same(callable(env, duration, '%r%D days'), '-02 days', 'should format negative duration with a sign when using %r');

            // months
            duration = Luxon.Duration.fromObject({months: 2}); // 2 months exactly

            test.same(callable(env, duration, '%M months'), '02 months');
            test.same(callable(env, duration, '%m months'), '2 months');

            duration = Luxon.Duration.fromObject({months: 2, days: 6}); // 2 months and 6 days

            test.same(callable(env, duration, '%M months'), '02 months');
            test.same(callable(env, duration, '%m months'), '2 months');

            // years
            duration = Luxon.Duration.fromObject({years: 2}); // 2 years exactly

            test.same(callable(env, duration, '%Y years'), '02 years');
            test.same(callable(env, duration, '%y years'), '2 years');

            duration = Luxon.Duration.fromObject({years: 2, months: 6}); // 2 years and 6 months

            test.same(callable(env, duration, '%Y years'), '02 years');
            test.same(callable(env, duration, '%y years'), '2 years');

            // years
            duration = Luxon.Duration.fromObject({years: 2, months: 6}); // 2 years and 6 months

            test.same(callable(env, duration, '%Y years and %M months'), '02 years and 06 months');

            test.end();
        });

        test.test('merge', function (test) {
            let filter = getFilter('merge');
            let callable = filter.getCallable();

            test.throws(function () {
                callable(null, []);
            }, new Error('The merge filter only works with arrays or "Traversable", got "null" as first argument.'));

            test.throws(function () {
                callable([], null);
            }, new Error('The merge filter only works with arrays or "Traversable", got "null" as second argument.'));

            test.throws(function () {
                callable(undefined, []);
            }, new Error('The merge filter only works with arrays or "Traversable", got "undefined" as first argument.'));

            test.throws(function () {
                callable([], undefined);
            }, new Error('The merge filter only works with arrays or "Traversable", got "undefined" as second argument.'));

            test.throws(function () {
                callable('a', []);
            }, new Error('The merge filter only works with arrays or "Traversable", got "string" as first argument.'));

            test.throws(function () {
                callable([], 'a');
            }, new Error('The merge filter only works with arrays or "Traversable", got "string" as second argument.'));

            test.same(callable(['a'], ['b']), new TwingMap([[0, 'a'], [1, 'b']]));

            test.end();
        });

        test.end();
    });

    test.end();
});
