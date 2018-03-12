import {Duration} from "luxon";

const pad = require('pad');

const padStart = function (value: number, length: number, padString: string): string {
    let result: string = '' + value;

    result = pad(length, result, padString);

    return result;
};

/**
 *
 * @param {"luxon".luxon.Duration} duration
 * @param {string} format
 * @returns {string} The formatted interval.
 */
export function formatDuration(duration: Duration, format: string): string {
    let result: string;

    result = format.replace(/%([YyMmDdaHhIiSsFfRr])/g, function (match, token) {
        let result: any;
        let isNegative: boolean = false;

        if (duration.as('milliseconds') < 0) {
            isNegative = true;
            duration = duration.negate();
        }

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
                result = isNegative ? '-' : '+';
                break;
            }
            case 'r': {
                // Sign "-" when negative, empty when positive
                result = isNegative ? '-' : '';
                break;
            }
        }

        return result;
    });

    return result;
}
