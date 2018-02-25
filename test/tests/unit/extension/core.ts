import {Test} from "tape";
import {TwingExtensionCore} from "../../../../src/extension/core";
import {TwingFilter} from "../../../../src/filter";
import {TwingMap} from "../../../../src/map";
import {TwingTestEnvironmentStub} from "../../../environment-stub";
import {TwingTestLoaderStub} from "../../../loader-stub";
import {DateTime, Interval, Settings} from "luxon";

const tap = require('tap');

let getFilter = function (name: string): TwingFilter {
    let extension = new TwingExtensionCore();

    return extension.getFilters().find(function (filter: TwingFilter) {
        return filter.getName() === name;
    });
};

tap.test('extension core', function (test: Test) {
    test.test('filter', function (test: Test) {
        test.test('date', function (test: any) {
            Settings.defaultZoneName = 'UTC';

            let filter = getFilter('date');
            let callable = filter.getCallable();
            let env = new TwingTestEnvironmentStub(new TwingTestLoaderStub());

            let date = DateTime.fromObject({
                year: 2001,
                hour: 12
            });

            test.same(callable(env, date), 'January 1, 2001 12:00');
            test.same(callable(env, date, 'U'), date.toJSDate().getTime());
            test.same(callable(env, date, 'j-U'), '1-' + date.toJSDate().getTime());

            /************/
            /* interval */
            /************/
            let interval: Interval;

            // default format
            interval = Interval.fromDateTimes(date, date.plus({days: 1})); // 1 day exactly

            test.same(callable(env, interval), '1 days');

            // microseconds
            interval = Interval.fromDateTimes(date, date.plus(2)); // +2000 microseconds exactly

            test.same(callable(env, interval, '%F microseconds'), '002000 microseconds');
            test.same(callable(env, interval, '%f microseconds'), '2000 microseconds');

            // seconds
            interval = Interval.fromDateTimes(date, date.plus({seconds: 2})); // 2 seconds exactly

            test.same(callable(env, interval, '%S seconds'), '02 seconds');
            test.same(callable(env, interval, '%s seconds'), '2 seconds');

            interval = Interval.fromDateTimes(date, date.plus({seconds: 2, milliseconds: 6})); // 2 seconds and 6 milliseconds

            test.same(callable(env, interval, '%S seconds'), '02 seconds');
            test.same(callable(env, interval, '%s seconds'), '2 seconds');

            // minutes
            interval = Interval.fromDateTimes(date, date.plus({minutes: 2})); // 2 minutes exactly

            test.same(callable(env, interval, '%I minutes'), '02 minutes');
            test.same(callable(env, interval, '%i minutes'), '2 minutes');

            interval = Interval.fromDateTimes(date, date.plus({minutes: 2, seconds: 6})); // 2 minutes and 6 seconds

            test.same(callable(env, interval, '%I minutes'), '02 minutes');
            test.same(callable(env, interval, '%i minutes'), '2 minutes');

            // hours
            interval = Interval.fromDateTimes(date, date.plus({hours: 2})); // 2 hours exactly

            test.same(callable(env, interval, '%H hours'), '02 hours');
            test.same(callable(env, interval, '%h hours'), '2 hours');

            interval = Interval.fromDateTimes(date, date.plus({hours: 2, minutes: 6})); // 2 hours and 6 minutes

            test.same(callable(env, interval, '%H hours'), '02 hours');
            test.same(callable(env, interval, '%h hours'), '2 hours');

            // days
            interval = Interval.fromDateTimes(date, date.plus({days: 2})); // 2 days exactly

            test.same(callable(env, interval, '%D days'), '02 days');
            test.same(callable(env, interval, '%a days'), '2 days');
            test.same(callable(env, interval, '%d days'), '2 days');

            interval = Interval.fromDateTimes(date, date.plus({days: 2, hours: 6})); // 2 days and 6 hours

            test.same(callable(env, interval, '%D days'), '02 days');
            test.same(callable(env, interval, '%a days'), '2 days');
            test.same(callable(env, interval, '%d days'), '2 days');

            // months
            interval = Interval.fromDateTimes(date, date.plus({months: 2})); // 2 months exactly

            test.same(callable(env, interval, '%M months'), '02 months');
            test.same(callable(env, interval, '%m months'), '2 months');

            interval = Interval.fromDateTimes(date, date.plus({months: 2, days: 6})); // 2 months and 6 days

            test.same(callable(env, interval, '%M months'), '02 months');
            test.same(callable(env, interval, '%m months'), '2 months');

            // years
            interval = Interval.fromDateTimes(date, date.plus({years: 2})); // 2 years exactly

            test.same(callable(env, interval, '%Y years'), '02 years');
            test.same(callable(env, interval, '%y years'), '2 years');

            interval = Interval.fromDateTimes(date, date.plus({years: 2, months: 6})); // 2 years and 6 months

            test.same(callable(env, interval, '%Y years'), '02 years');
            test.same(callable(env, interval, '%y years'), '2 years');

            // years
            interval = Interval.fromDateTimes(date, date.plus({years: 2, months: 6})); // 2 years and 6 months

            test.same(callable(env, interval, '%Y years and %M months'), '02 years and 06 months');

            test.end();
        });

        test.test('merge', function (test: any) {
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
