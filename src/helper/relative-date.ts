import {DateTime} from "luxon";

export default function relativeDate(date: string): DateTime {
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
}