import TwingEnvironment from "../environment";
import {DateTime} from "luxon";

const dateformatConverter = require('dateformat-converter');

/**
 *
 * @param {TwingEnvironment} env
 * @param {"luxon".luxon.DateTime} date
 * @param {string} format
 * @returns {string}
 */
export default function formatDateTime(date: DateTime, format: string = null) {
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
        unixTimestamp: 'U',
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
        unixTimestamp: date.toJSDate().getTime().toString(),
        timezoneName: 'ZZ'
    };

    dateformatConverter.loadConfig('iso', isoConfig);
    dateformatConverter.loadConfig('php', phpConfig);

    let iso = dateformatConverter.convert(format, 'php', 'iso');

    return date.toFormat(iso);
}
