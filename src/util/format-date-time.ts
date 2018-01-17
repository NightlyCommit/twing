/**
 * Converts a date to the given format.
 *
 * <pre>
 *   {{ post.published_at|date("m/d/Y") }}
 * </pre>
 *
 * @param {TwingEnvironment} env
 * @param {DateTime|Interval|string} date A date
 * @param {string|null} format The target format, null to use the default
 * @param {string|null|false} timezone The target timezone, null to use the default, false to leave unchanged
 *
 * @return string The formatted date
 */
import TwingEnvironment from "../environment";
import {DateTime} from "luxon";

const dateformatConverter = require('dateformat-converter');

export default function twingFormatDateTime(env: TwingEnvironment, date: DateTime, format: string = null) {
    if (format === null) {
        let coreExtension = env.getCoreExtension();
        let formats = coreExtension.getDateFormat();

        format = formats[0];
    }

    if (format === 'r') {
        return date.toRFC2822();
    }

    let phpConfig = {
        lowerCaseMeridian: 'e',
        secondsLeading: 's',
        minutesLeading: 'i',
        hoursSimple24Format: 'G',
        hoursLeading24Format: 'H',
        hoursSimple12Format: 'g',
        hoursLeading12Format: 'h',
        daysSimple: 'j',
        daysLeading: 'd',
        monthsSimple: 'n',
        monthsLeading: 'm',
        monthsSimpleText: 'M',
        monthsFullText: 'F',
        yearsTwoDigits: 'y',
        yearsFourDigits: 'Y',
        unixTimestamp: 'X',
        timezoneName: 'P'
    };

    let isoConfig = {
        lowerCaseMeridian: 'z',
        secondsSimple: 's',
        secondsLeading: 'ss',
        minutesSimple: 'm',
        minutesLeading: 'mm',
        hoursSimple24Format: 'H',
        hoursLeading24Format: 'HH',
        hoursSimple12Format: 'h',
        hoursLeading12Format: 'hh',
        daysSimple: 'd',
        daysLeading: 'dd',
        monthsSimple: 'M',
        monthsLeading: 'MM',
        monthsSimpleText: 'MMM',
        monthsFullText: 'MMMM',
        yearsTwoDigits: 'yy',
        yearsFourDigits: 'yyyy',
        unixTimestamp: 'X',
        timezoneName: 'ZZ'
    };

    dateformatConverter.loadConfig('iso', isoConfig);
    dateformatConverter.loadConfig('php', phpConfig);

    let iso = dateformatConverter.convert(format, 'php', 'iso');

    return date.toFormat(iso);
};