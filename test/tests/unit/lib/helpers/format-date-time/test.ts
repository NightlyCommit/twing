import * as tape from 'tape';
import {formatDateTime} from "../../../../../../src/lib/helpers/format-date-time";

const {DateTime} = require('luxon');

// Thursday, January 1, 1970 4:12:29 PM
let date = DateTime.fromMillis(58349457, {zone: 'UTC'});
// Tuesday, February 2, 1971 4:12:29 AM
let date2 = DateTime.fromMillis(34315949457, {zone: 'UTC'});
// Friday, March 3, 1972 4:12:29 PM
let date3 = DateTime.fromMillis(68487149457, {zone: 'UTC'});
// Wednesday, April 4, 1973 4:12:29 PM
let date4 = DateTime.fromMillis(102744749457, {zone: 'UTC+1'});
// Wednesday, April 15, 1973 4:12:29 PM
let date5 = DateTime.fromMillis(114235949457, {zone: 'UTC+1'});
// Wednesday, August 15, 1973 4:12:29 PM
let dateInDst = DateTime.fromMillis(114235949457, {zone: 'America/New_York'});

tape('format-date-time', (test) => {
    test.same(formatDateTime(date, 'd'), '01', 'Day of the month, 2 digits with leading zeros');
    test.same(formatDateTime(date2, 'd'), '02', 'Day of the month, 2 digits with leading zeros');
    test.same(formatDateTime(date3, 'd'), '03', 'Day of the month, 2 digits with leading zeros');
    test.same(formatDateTime(date4, 'd'), '04', 'Day of the month, 2 digits with leading zeros');

    test.same(formatDateTime(date, 'D'), 'Thu', 'A textual representation of a day, three letters');
    test.same(formatDateTime(date2, 'D'), 'Tue', 'A textual representation of a day, three letters');
    test.same(formatDateTime(date3, 'D'), 'Fri', 'A textual representation of a day, three letters');
    test.same(formatDateTime(date4, 'D'), 'Wed', 'A textual representation of a day, three letters');

    test.same(formatDateTime(date, 'j'), '1', 'Day of the month without leading zeros');
    test.same(formatDateTime(date2, 'j'), '2', 'Day of the month without leading zeros');
    test.same(formatDateTime(date3, 'j'), '3', 'Day of the month without leading zeros');
    test.same(formatDateTime(date4, 'j'), '4', 'Day of the month without leading zeros');

    test.same(formatDateTime(date, 'l'), 'Thursday', 'A full textual representation of the day of the week');
    test.same(formatDateTime(date2, 'l'), 'Tuesday', 'A full textual representation of the day of the week');
    test.same(formatDateTime(date3, 'l'), 'Friday', 'A full textual representation of the day of the week');
    test.same(formatDateTime(date4, 'l'), 'Wednesday', 'A full textual representation of the day of the week');

    test.same(formatDateTime(date, 'N'), '4', 'ISO-8601 numeric representation of the day of the week (starting from 1)');
    test.same(formatDateTime(date2, 'N'), '2', 'ISO-8601 numeric representation of the day of the week (starting from 1)');
    test.same(formatDateTime(date3, 'N'), '5', 'ISO-8601 numeric representation of the day of the week (starting from 1)');
    test.same(formatDateTime(date4, 'N'), '3', 'ISO-8601 numeric representation of the day of the week (starting from 1)');

    test.same(formatDateTime(date, 'S'), 'st', 'English ordinal suffix for the day of the month, 2 characters');
    test.same(formatDateTime(date2, 'S'), 'nd', 'English ordinal suffix for the day of the month, 2 characters');
    test.same(formatDateTime(date3, 'S'), 'rd', 'English ordinal suffix for the day of the month, 2 characters');
    test.same(formatDateTime(date4, 'S'), 'th', 'English ordinal suffix for the day of the month, 2 characters');
    test.same(formatDateTime(date5, 'S'), 'th', 'English ordinal suffix for the day of the month, 2 characters');

    test.same(formatDateTime(date, 'w'), '3', 'Numeric representation of the day of the week (starting from 0)');
    test.same(formatDateTime(date2, 'w'), '1', 'Numeric representation of the day of the week (starting from 0)');
    test.same(formatDateTime(date3, 'w'), '4', 'Numeric representation of the day of the week (starting from 0)');
    test.same(formatDateTime(date4, 'w'), '2', 'Numeric representation of the day of the week (starting from 0)');

    test.same(formatDateTime(date, 'z'), '0', 'The day of the year (starting from 0)');
    test.same(formatDateTime(date2, 'z'), '32', 'The day of the year (starting from 0)');
    test.same(formatDateTime(date3, 'z'), '62', 'The day of the year (starting from 0)');
    test.same(formatDateTime(date4, 'z'), '93', 'The day of the year (starting from 0)');

    test.same(formatDateTime(date, 'W'), '01', 'ISO-8601 week number of year, weeks starting on Monday');
    test.same(formatDateTime(date2, 'W'), '05', 'ISO-8601 week number of year, weeks starting on Monday');
    test.same(formatDateTime(date3, 'W'), '09', 'ISO-8601 week number of year, weeks starting on Monday');
    test.same(formatDateTime(date4, 'W'), '14', 'ISO-8601 week number of year, weeks starting on Monday');

    test.same(formatDateTime(date, 'F'), 'January', 'A full textual representation of a month, such as January or March');
    test.same(formatDateTime(date2, 'F'), 'February', 'A full textual representation of a month, such as January or March');
    test.same(formatDateTime(date3, 'F'), 'March', 'A full textual representation of a month, such as January or March');
    test.same(formatDateTime(date4, 'F'), 'April', 'A full textual representation of a month, such as January or March');

    test.same(formatDateTime(date, 'm'), '01', 'Numeric representation of a month, with leading zeros');
    test.same(formatDateTime(date2, 'm'), '02', 'Numeric representation of a month, with leading zeros');
    test.same(formatDateTime(date3, 'm'), '03', 'Numeric representation of a month, with leading zeros');
    test.same(formatDateTime(date4, 'm'), '04', 'Numeric representation of a month, with leading zeros');

    test.same(formatDateTime(date, 'M'), 'Jan', 'A short textual representation of a month, three letters');
    test.same(formatDateTime(date2, 'M'), 'Feb', 'A short textual representation of a month, three letters');
    test.same(formatDateTime(date3, 'M'), 'Mar', 'A short textual representation of a month, three letters');
    test.same(formatDateTime(date4, 'M'), 'Apr', 'A short textual representation of a month, three letters');

    test.same(formatDateTime(date, 'n'), '1', 'Numeric representation of a month, without leading zero');
    test.same(formatDateTime(date2, 'n'), '2', 'Numeric representation of a month, without leading zero');
    test.same(formatDateTime(date3, 'n'), '3', 'Numeric representation of a month, without leading zero');
    test.same(formatDateTime(date4, 'n'), '4', 'Numeric representation of a month, without leading zero');

    test.same(formatDateTime(date, 't'), '31', 'Number of days in the given month');
    test.same(formatDateTime(date2, 't'), '28', 'Number of days in the given month');
    test.same(formatDateTime(date3, 't'), '31', 'Number of days in the given month');
    test.same(formatDateTime(date4, 't'), '30', 'Number of days in the given month');

    test.same(formatDateTime(date, 'L'), '0', 'Whether it\'s a leap year');
    test.same(formatDateTime(date2, 'L'), '0', 'Whether it\'s a leap year');
    test.same(formatDateTime(date3, 'L'), '1', 'Whether it\'s a leap year');
    test.same(formatDateTime(date4, 'L'), '0', 'Whether it\'s a leap year');

    test.same(formatDateTime(date, 'o'), '1970', 'ISO-8601 week-numbering year. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead.');
    test.same(formatDateTime(date2, 'o'), '1971', 'ISO-8601 week-numbering year. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead.');
    test.same(formatDateTime(date3, 'o'), '1972', 'ISO-8601 week-numbering year. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead.');
    test.same(formatDateTime(date4, 'o'), '1973', 'ISO-8601 week-numbering year. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead.');

    test.same(formatDateTime(date, 'Y'), '1970', 'A full numeric representation of a year, 4 digits');
    test.same(formatDateTime(date2, 'Y'), '1971', 'A full numeric representation of a year, 4 digits');
    test.same(formatDateTime(date3, 'Y'), '1972', 'A full numeric representation of a year, 4 digits');
    test.same(formatDateTime(date4, 'Y'), '1973', 'A full numeric representation of a year, 4 digits');

    test.same(formatDateTime(date, 'y'), '70', 'A two digit representation of a year');
    test.same(formatDateTime(date2, 'y'), '71', 'A two digit representation of a year');
    test.same(formatDateTime(date3, 'y'), '72', 'A two digit representation of a year');
    test.same(formatDateTime(date4, 'y'), '73', 'A two digit representation of a year');

    test.same(formatDateTime(date, 'a'), 'pm', 'Lowercase Ante meridiem and Post meridiem');
    test.same(formatDateTime(date2, 'a'), 'am', 'Lowercase Ante meridiem and Post meridiem');
    test.same(formatDateTime(date3, 'a'), 'pm', 'Lowercase Ante meridiem and Post meridiem');
    test.same(formatDateTime(date4, 'a'), 'am', 'Lowercase Ante meridiem and Post meridiem');

    test.same(formatDateTime(date, 'A'), 'PM', 'Uppercase Ante meridiem and Post meridiem');
    test.same(formatDateTime(date2, 'A'), 'AM', 'Uppercase Ante meridiem and Post meridiem');
    test.same(formatDateTime(date3, 'A'), 'PM', 'Uppercase Ante meridiem and Post meridiem');
    test.same(formatDateTime(date4, 'A'), 'AM', 'Uppercase Ante meridiem and Post meridiem');

    test.same(formatDateTime(date, 'B'), '675', 'Swatch Internet time');
    test.same(formatDateTime(date2, 'B'), '175', 'Swatch Internet time');
    test.same(formatDateTime(date3, 'B'), '675', 'Swatch Internet time');
    test.same(formatDateTime(date4, 'B'), '217', 'Swatch Internet time');

    test.same(formatDateTime(date, 'g'), '4', '12-hour format of an hour without leading zeros');
    test.same(formatDateTime(date2, 'g'), '4', '12-hour format of an hour without leading zeros');
    test.same(formatDateTime(date3, 'g'), '4', '12-hour format of an hour without leading zeros');
    test.same(formatDateTime(date4, 'g'), '5', '12-hour format of an hour without leading zeros');

    test.same(formatDateTime(date, 'G'), '16', '24-hour format of an hour without leading zeros');
    test.same(formatDateTime(date2, 'G'), '4', '24-hour format of an hour without leading zeros');
    test.same(formatDateTime(date3, 'G'), '16', '24-hour format of an hour without leading zeros');
    test.same(formatDateTime(date4, 'G'), '5', '24-hour format of an hour without leading zeros');

    test.same(formatDateTime(date, 'h'), '04', '12-hour format of an hour with leading zeros');
    test.same(formatDateTime(date2, 'h'), '04', '12-hour format of an hour with leading zeros');
    test.same(formatDateTime(date3, 'h'), '04', '12-hour format of an hour with leading zeros');
    test.same(formatDateTime(date4, 'h'), '05', '12-hour format of an hour with leading zeros');

    test.same(formatDateTime(date, 'H'), '16', '24-hour format of an hour with leading zeros');
    test.same(formatDateTime(date2, 'H'), '04', '24-hour format of an hour with leading zeros');
    test.same(formatDateTime(date3, 'H'), '16', '24-hour format of an hour with leading zeros');
    test.same(formatDateTime(date4, 'H'), '05', '24-hour format of an hour with leading zeros');

    test.same(formatDateTime(date, 'i'), '12', 'Minutes with leading zeros');
    test.same(formatDateTime(date2, 'i'), '12', 'Minutes with leading zeros');
    test.same(formatDateTime(date3, 'i'), '12', 'Minutes with leading zeros');
    test.same(formatDateTime(date4, 'i'), '12', 'Minutes with leading zeros');

    test.same(formatDateTime(date, 's'), '29', 'Seconds, with leading zeros');
    test.same(formatDateTime(date2, 's'), '29', 'Seconds, with leading zeros');
    test.same(formatDateTime(date3, 's'), '29', 'Seconds, with leading zeros');
    test.same(formatDateTime(date4, 's'), '29', 'Seconds, with leading zeros');

    test.same(formatDateTime(date, 'u'), '457000', 'Microseconds');
    test.same(formatDateTime(date2, 'u'), '457000', 'Microseconds');
    test.same(formatDateTime(date3, 'u'), '457000', 'Microseconds');
    test.same(formatDateTime(date4, 'u'), '457000', 'Microseconds');

    test.same(formatDateTime(date, 'v'), '457', 'Milliseconds');
    test.same(formatDateTime(date2, 'v'), '457', 'Milliseconds');
    test.same(formatDateTime(date3, 'v'), '457', 'Milliseconds');
    test.same(formatDateTime(date4, 'v'), '457', 'Milliseconds');

    test.same(formatDateTime(date, 'e'), 'UTC', 'Timezone identifier');
    test.same(formatDateTime(date2, 'e'), 'UTC', 'Timezone identifier');
    test.same(formatDateTime(date3, 'e'), 'UTC', 'Timezone identifier');
    test.same(formatDateTime(date4, 'e'), 'UTC+1', 'Timezone identifier');

    test.same(formatDateTime(date, 'I'), '0', 'Whether or not the date is in daylight saving time');
    test.same(formatDateTime(date2, 'I'), '0', 'Whether or not the date is in daylight saving time');
    test.same(formatDateTime(date3, 'I'), '0', 'Whether or not the date is in daylight saving time');
    test.same(formatDateTime(date4, 'I'), '0', 'Whether or not the date is in daylight saving time');
    test.same(formatDateTime(dateInDst, 'I'), '1', 'Whether or not the date is in daylight saving time');

    test.same(formatDateTime(date, 'O'), '+0000', 'Difference to Greenwich time (GMT) in hours');
    test.same(formatDateTime(date2, 'O'), '+0000', 'Difference to Greenwich time (GMT) in hours');
    test.same(formatDateTime(date3, 'O'), '+0000', 'Difference to Greenwich time (GMT) in hours');
    test.same(formatDateTime(date4, 'O'), '+0100', 'Difference to Greenwich time (GMT) in hours');

    test.same(formatDateTime(date, 'P'), '+00:00', 'Difference to Greenwich time (GMT) with colon between hours and minutes');
    test.same(formatDateTime(date2, 'P'), '+00:00', 'Difference to Greenwich time (GMT) with colon between hours and minutes');
    test.same(formatDateTime(date3, 'P'), '+00:00', 'Difference to Greenwich time (GMT) with colon between hours and minutes');
    test.same(formatDateTime(date4, 'P'), '+01:00', 'Difference to Greenwich time (GMT) with colon between hours and minutes');

    test.same(formatDateTime(date, 'T'), 'UTC', 'Timezone abbreviation');
    test.same(formatDateTime(date2, 'T'), 'UTC', 'Timezone abbreviation');
    test.same(formatDateTime(date3, 'T'), 'UTC', 'Timezone abbreviation');
    test.same(formatDateTime(date4, 'T'), 'UTC+1', 'Timezone abbreviation');

    test.same(formatDateTime(date, 'Z'), '0', 'Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.');
    test.same(formatDateTime(date2, 'Z'), '0', 'Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.');
    test.same(formatDateTime(date3, 'Z'), '0', 'Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.');
    test.same(formatDateTime(date4, 'Z'), '3600', 'Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.');

    test.same(formatDateTime(date, 'c'), '1970-01-01T16:12:29+00:00', 'ISO 8601 date');
    test.same(formatDateTime(date2, 'c'), '1971-02-02T04:12:29+00:00', 'ISO 8601 date');
    test.same(formatDateTime(date3, 'c'), '1972-03-03T16:12:29+00:00', 'ISO 8601 date');
    test.same(formatDateTime(date4, 'c'), '1973-04-04T05:12:29+01:00', 'ISO 8601 date');

    test.same(formatDateTime(date, 'r'), 'Thu, 01 Jan 1970 16:12:29 +0000', 'RFC 2822 formatted date');
    test.same(formatDateTime(date2, 'r'), 'Tue, 02 Feb 1971 04:12:29 +0000', 'RFC 2822 formatted date');
    test.same(formatDateTime(date3, 'r'), 'Fri, 03 Mar 1972 16:12:29 +0000', 'RFC 2822 formatted date');
    test.same(formatDateTime(date4, 'r'), 'Wed, 04 Apr 1973 05:12:29 +0100', 'RFC 2822 formatted date');

    test.same(formatDateTime(date, 'U'), '58349', 'Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)');
    test.same(formatDateTime(date2, 'U'), '34315949', 'Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)');
    test.same(formatDateTime(date3, 'U'), '68487149', 'Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)');
    test.same(formatDateTime(date4, 'U'), '102744749', 'Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)');

    test.end();
});