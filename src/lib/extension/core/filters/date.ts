import {TwingEnvironment} from "../../../environment";
import {DateTime, Duration} from "luxon";
import {formatDuration} from "../../../helpers/format-duration";
import {formatDateTime} from "../../../helpers/format-date-time";
import {twingFunctionDate} from "../functions/date";

/**
 * Converts a date to the given format.
 *
 * <pre>
 *   {{ post.published_at|date("m/d/Y") }}
 * </pre>
 *
 * @param {TwingEnvironment} env
 * @param {DateTime|Duration|string} date A date
 * @param {string|null} format The target format, null to use the default
 * @param {string|null|boolean} timezone The target timezone, null to use the default, false to leave unchanged
 *
 * @return string The formatted date
 */
export function twingFilterDate(env: TwingEnvironment, date: DateTime | Duration | string, format: string = null, timezone: string | null | false = null) {
    if (format === null) {
        let coreExtension = env.getCoreExtension();

        let formats = coreExtension.getDateFormat();

        format = date instanceof Duration ? formats[1] : formats[0];
    }

    date = twingFunctionDate(env, date, timezone);

    if (date instanceof Duration) {
        return formatDuration(date, format);
    }

    return formatDateTime(date, format);
}
