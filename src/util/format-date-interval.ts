/**
 *
 * @param {"luxon".luxon.Interval} interval
 * @param {string} format
 * @returns {string} The formatted interval.
 *
 * @see http://php.net/manual/en/dateinterval.format.php
 */
import TwingEnvironment from "../environment";
import {Duration, Interval} from "luxon";

const pad = require('pad');

const padStart = function (value: number, length: number = 1, padString: string = ' '): string {
    let result: string = '' + value;

    result = pad(length, result, padString);

    return result;
};

export default function twingFormatDateInterval(env: TwingEnvironment, interval: Interval, format: string): string {
    let self = this;

    if (format === null) {
        let coreExtension = env.getCoreExtension();
        let formats = coreExtension.getDateFormat();

        format = formats[1];
    }

    let result: string;
    let units = ['years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];
    let duration: Duration = interval.toDuration(units);

    // console.warn(interval);

    result = format.replace(/%([YyMmDdaHhIiSsFfRr])/g, function (match, token) {
        let result: any;

        switch (token) {
            case 'Y': {
                // 	Years, numeric, at least 2 digits with leading 0
                result = padStart(duration.years, 2, '0');
                break;
            }
            case 'y': {
                // Years, numeric
                result = duration.years;
                break;
            }
            case 'M': {
                // Months, numeric, at least 2 digits with leading 0
                result = padStart(duration.months, 2, '0');
                break;
            }
            case 'm': {
                // Months, numeric
                result = duration.months;
                break;
            }
            case 'D': {
                // Days, numeric, at least 2 digits with leading 0
                result = padStart(duration.days, 2, '0');
                break;
            }
            case 'd':
            case 'a': {
                // Days, numeric
                // Total number of days as a result of a DateTime::diff() or (unknown) otherwise
                result = duration.days;
                break;
            }
            case 'H': {
                // Hours, numeric, at least 2 digits with leading 0
                result = padStart(duration.hours, 2, '0');
                break;
            }
            case 'h': {
                // Hours, numeric
                result = duration.hours;
                break;
            }
            case 'I': {
                // Minutes, numeric, at least 2 digits with leading 0
                result = padStart(duration.minutes, 2, '0');
                break;
            }
            case 'i': {
                // 	Minutes, numeric
                result = duration.minutes;
                break;
            }
            case 'S': {
                // 	Seconds, numeric, at least 2 digits with leading 0
                result = padStart(duration.seconds, 2, '0');
                break;
            }
            case 's': {
                // Seconds, numeric
                result = duration.seconds;
                break;
            }
            case 'F': {
                // Microseconds, numeric, at least 6 digits with leading 0
                result = padStart(duration.milliseconds * 1000, 6, '0');
                break;
            }
            case 'f': {
                // Microseconds, numeric
                result = duration.milliseconds * 1000;
                break;
            }
            case 'R': {
                // Sign "-" when negative, "+" when positive
                result = interval.length() >= 0 ? (interval.length() > 0 ? '+' : '') : '-';
                break;
            }
            case 'r': {
                // Sign "-" when negative, empty when positive
                result = interval.length() > 0 ? '' : '-';
                break;
            }
        }

        return result;
    });

    return result;
}