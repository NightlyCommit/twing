import {DateTime} from 'luxon';

/**
 * For the formats reference, @see https://secure.php.net/manual/en/function.date.php
 */
const formatters: { [s: string]: (d: DateTime) => string | number } = {
    d: (dateTime) => {
        /**
         * Day of the month, 2 digits with leading zeros
         */
        return dateTime.toFormat('dd');
    },
    D: (dateTime) => {
        /**
         * A textual representation of a day, three letters
         */
        return dateTime.weekdayShort;
    },
    j: (dateTime) => {
        /**
         * Day of the month without leading zeros
         */
        return dateTime.day;
    },
    l: (dateTime) => {
        /**
         * A full textual representation of the day of the week
         */
        return dateTime.weekdayLong;
    },
    N: (dateTime) => {
        /**
         * ISO-8601 numeric representation of the day of the week (starting from 1)
         */
        return dateTime.weekday;
    },
    S: (dateTime) => {
        /**
         * English ordinal suffix for the day of the month, 2 characters
         */
        const day = dateTime.day;

        if ((day >= 10) && (day <= 20)) {
            return 'th';
        }

        switch (day % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    },
    w: (dateTime) => {
        /**
         * Numeric representation of the day of the week (starting from 0)
         */
        return dateTime.weekday - 1
    },
    z: (dateTime) => {
        /**
         * The day of the year (starting from 0)
         */
        return dateTime.ordinal - 1;
    },
    L: (dateTime) => {
        /**
         * Whether it's a leap year
         */
        return dateTime.isInLeapYear ? 1 : 0;
    },
    o: (dateTime) => {
        /**
         * ISO-8601 week-numbering year. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead.
         */
        return formatters.Y(dateTime);
    },
    W: (dateTime) => {
        /**
         * ISO-8601 week number of year, weeks starting on Monday
         */
        return dateTime.toFormat('WW');
    },
    F: (dateTime) => {
        /**
         * A full textual representation of a month, such as January or March
         */
        return dateTime.toFormat('LLLL');
    },
    m: (dateTime) => {
        /**
         * Numeric representation of a month, with leading zeros
         */
        return dateTime.toFormat('LL');
    },
    M: (dateTime) => {
        /**
         * A short textual representation of a month, three letters
         */
        return dateTime.toFormat('LLL');
    },
    n: (dateTime) => {
        /**
         * Numeric representation of a month, without leading zero
         */
        return dateTime.toFormat('L');
    },
    t: (dateTime) => {
        /**
         * Number of days in the given month
         */
        return dateTime.daysInMonth;
    },
    Y: (dateTime) => {
        /**
         * A full numeric representation of a year, 4 digits
         */
        return dateTime.toFormat('yyyy');
    },
    y: (dateTime) => {
        /**
         * A two digit representation of a year
         */
        return dateTime.toFormat('yy');
    },
    a: (dateTime) => {
        /**
         * Lowercase Ante meridiem and Post meridiem
         */
        return (formatters.A(dateTime) as string).toLowerCase();
    },
    A: (dateTime) => {
        /**
         * Uppercase Ante meridiem and Post meridiem
         */
        return dateTime.toFormat('a');
    },
    B: (dateTime) => {
        /**
         * Swatch Internet time
         */
        return Math.floor((dateTime.second + (dateTime.minute * 60) + (dateTime.hour * 3600)) / 86.4);
    },
    g: (dateTime) => {
        /**
         * 12-hour format of an hour without leading zeros
         */
        return dateTime.toFormat('h');
    },
    G: (dateTime) => {
        /**
         * 24-hour format of an hour without leading zeros
         */
        return dateTime.toFormat('H');
    },
    h: (dateTime) => {
        /**
         * 12-hour format of an hour with leading zeros
         */
        return dateTime.toFormat('hh');
    },
    H: (dateTime) => {
        /**
         * 24-hour format of an hour with leading zeros
         */
        return dateTime.toFormat('HH');
    },
    i: (dateTime) => {
        /**
         * Minutes with leading zeros
         */
        return dateTime.toFormat('mm');
    },
    s: (dateTime) => {
        /**
         * Seconds, with leading zeros
         */
        return dateTime.toFormat('ss');
    },
    u: (dateTime) => {
        /**
         * Microseconds
         */
        return dateTime.millisecond * 1000;
    },
    v: (dateTime) => {
        /**
         * Milliseconds
         */
        return dateTime.millisecond;
    },
    e: (dateTime) => {
        /**
         * Timezone identifier
         */
        return dateTime.toFormat('z');
    },
    I: (dateTime) => {
        /**
         * Whether or not the date is in daylight saving time
         */
        return dateTime.isInDST ? 1 : 0;
    },
    O: (dateTime) => {
        /**
         * Difference to Greenwich time (GMT) in hours
         */
        return dateTime.toFormat('ZZZ');
    },
    P: (dateTime) => {
        /**
         * Difference to Greenwich time (GMT) with colon between hours and minutes
         */
        return dateTime.toFormat('ZZ');
    },
    T: (dateTime) => {
        /**
         * Timezone abbreviation
         */
        return dateTime.toFormat('ZZZZ');
    },
    Z: (dateTime) => {
        /**
         * Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.
         */
        return dateTime.offset * 60;
    },
    c: (dateTime) => {
        /**
         * ISO 8601 date
         */
        return formatDateTime(dateTime, 'Y-m-d') + 'T' + formatDateTime(dateTime, 'H:i:s') + formatters.P(dateTime);
    },
    r: (dateTime) => {
        /**
         * RFC 2822 formatted date
         */
        return formatDateTime(dateTime, 'D, d M Y H:i:s ') + formatters.O(dateTime);
    },
    U: (dateTime) => {
        /**
         * Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
         */
        return Math.floor(dateTime.toMillis() / 1000);
    }
};

const regExp = new RegExp(`[${Object.keys(formatters).join("")}]`, 'g');

export function formatDateTime(date: DateTime, format: string) {
    return format.replace(regExp, (m: string): string => {
        return formatters[m](date) as string;
    });
}
