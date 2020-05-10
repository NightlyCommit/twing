import {DateTime, Duration} from "luxon";
import {formatDuration} from "../../../helpers/format-duration";
import {formatDateTime} from "../../../helpers/format-date-time";
import {date as createDate} from "../functions/date";
import {TwingTemplate} from "../../../template";

/**
 * Converts a date to the given format.
 *
 * <pre>
 *   {{ post.published_at|date("m/d/Y") }}
 * </pre>
 *
 * @param {TwingTemplate} template
 * @param {DateTime|Duration|string} date A date
 * @param {string|null} format The target format, null to use the default
 * @param {string|null|boolean} timezone The target timezone, null to use the default, false to leave unchanged
 *
 * @return {Promise<string>} The formatted date
 */
export function date(template: TwingTemplate, date: DateTime | Duration | string, format: string = null, timezone: string | null | false = null): Promise<string> {
    if (format === null) {
        let coreExtension = template.environment.getCoreExtension();

        let formats = coreExtension.getDateFormat();

        format = date instanceof Duration ? formats[1] : formats[0];
    }

    return createDate(template, date, timezone).then((date) => {
        if (date instanceof Duration) {
            return Promise.resolve(formatDuration(date, format));
        }

        return Promise.resolve(formatDateTime(date, format));
    });
}
