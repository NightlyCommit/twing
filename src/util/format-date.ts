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
import {DateTime, Interval} from "luxon";

import formatDateTime from './format-date-time';
import formatDateInterval from './format-date-interval';
import ensureDateTime from './ensure-date-time';

export default function twingFormatDate(env: TwingEnvironment, date: DateTime | Interval | string, format: string = null, timezone: string | null | false = null) {
    if (format === null) {
        let coreExtension = env.getCoreExtension();

        let formats = coreExtension.getDateFormat();

        format = date instanceof Interval ? formats[1] : formats[0];
    }

    date = ensureDateTime(env, date, timezone);

    if (date instanceof Interval) {
        return formatDateInterval(env, date, format);
    }

    return formatDateTime(env, date, format);
};