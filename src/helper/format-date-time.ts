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
export default function formatDateTime(env: TwingEnvironment, date: DateTime, format: string = null) {
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
}
