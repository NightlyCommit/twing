import TwingEnvironment from "../environment";
import TwingErrorRuntime from "../error/runtime";
import {DateTime, Interval} from "luxon";
import {isNumber} from "util";

const moment = require('moment');

import formatDateTime from './format-date-time';

let relativeDate = function twingEnsureDateTime(date: string): DateTime {
    let result = null;
    let regExp = /^([-|\+])([0-9]+?)(.*)/g;

    let matches: RegExpExecArray = regExp.exec(date);

    if (matches) {
        result = DateTime.local();

        let sign = matches[1];
        let count: number = parseInt(matches[2]);
        let unit = matches[3];

        switch (unit) {
            case 'year':
                unit = 'years';
                break;
            case 'month':
                unit = 'months';
                break;
            case 'day':
                unit = 'days';
                break;
            case 'hour':
                unit = 'hours';
                break;
            case 'minute':
                unit = 'minutes';
                break;
            case 'second':
                unit = 'seconds';
                break;
            case 'microsecond':
                unit = 'milliseconds';
                count = count * 1000;
                break;
        }

        let duration: any = {};

        duration[unit] = (sign === '-' ? -count : count);

        result = result.plus(duration);
    }
    else {
        result = DateTime.invalid(`Failed to parse relative date "${date}".`);
    }

    return result;
};

export default function ensureDateTime(env: TwingEnvironment, date: Date | DateTime | Interval | number | string, timezone: string | null | false = null): DateTime | Interval {
    let result: DateTime;
    let coreExtension = env.getCoreExtension();

    // determine the timezone
    if (timezone !== false) {
        if (timezone === null) {
            timezone = coreExtension.getTimezone();
        }
    }

    if (date instanceof DateTime) {

        if (timezone !== false) {
            date = date.setZone(timezone);
        }

        return date;
    }

    if (date instanceof Interval) {
        return date;
    }

    let parsedUtcOffset = 0;

    if (!date) {
        result = DateTime.local();
    }
    else if (date instanceof Date) {
        result = DateTime.fromJSDate(date);
    }
    else if (typeof date === 'string') {
        if (date === 'now') {
            result = DateTime.local();
        }
        else {
            result = DateTime.fromISO(date);

            if (!result.isValid) {
                result = DateTime.fromRFC2822(date);
            }

            if (!result.isValid) {
                result = DateTime.fromSQL(date);
            }

            if (result.isValid) {
                parsedUtcOffset = moment.parseZone(date as string).utcOffset();
            }
            else {
                result = relativeDate(date);
            }
        }
    }
    else if (isNumber(date)) {
        // date is PHP timestamp - i.e. in seconds
        let ts = date as number * 1000;

        // timestamp are UTC by definition
        result = DateTime.fromMillis(ts, {
            setZone: false
        });
    }

    if (!result.isValid) {
        throw new TwingErrorRuntime(`Failed to parse date "${date}".`);
    }

    if (timezone !== false) {
        result = result.setZone(timezone);
    }
    else {
        if (parsedUtcOffset) {
            // explicit UTC offset
            result = result.setZone(`UTC+${parsedUtcOffset / 60}`);
        }
    }

    Reflect.set(result, 'format', function (format: string) {
        return formatDateTime(env, this);
    });

    return result;
}