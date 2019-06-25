import {TwingEnvironment} from "../../../environment";
import {DateTime, Duration} from "luxon";
import {relativeDate} from "../../../helpers/relative-date";
import {TwingErrorRuntime} from "../../../error/runtime";
import {formatDateTime} from "../../../helpers/format-date-time";

/**
 * Converts an input to a DateTime instance.
 *
 * <pre>
 *    {% if date(user.created_at) < date('+2days') %}
 *      {# do something #}
 *    {% endif %}
 * </pre>
 *
 * @param {TwingEnvironment} env
 * @param {Date | DateTime | Duration | number | string} date A date or null to use the current time
 * @param {string | null | boolean} timezone The target timezone, null to use the default, false to leave unchanged
 *
 * @returns {DateTime} A DateTime instance
 */
export function twingFunctionDate(env: TwingEnvironment, date: Date | DateTime | Duration | number | string, timezone: string | null | false = null): DateTime | Duration {
    let result: DateTime;
    let core = env.getCoreExtension();

    // determine the timezone
    if (timezone !== false) {
        if (timezone === null) {
            timezone = core.getTimezone();
        }
    }

    if (date instanceof DateTime) {
        if (timezone !== false) {
            date = date.setZone(timezone);
        }

        return date;
    }

    if (date instanceof Duration) {
        return date;
    }

    let parsedUtcOffset = 0;

    if (!date) {
        result = DateTime.local();
    } else if (date instanceof Date) {
        result = DateTime.fromJSDate(date);
    } else if (typeof date === 'string') {
        if (date === 'now') {
            result = DateTime.local();
        } else {
            result = DateTime.fromISO(date, {setZone: true});

            if (!result.isValid) {
                result = DateTime.fromRFC2822(date, {setZone: true});
            }

            if (!result.isValid) {
                result = DateTime.fromSQL(date, {setZone: true});
            }

            if (result.isValid) {
                parsedUtcOffset = result.offset;
            } else {
                result = relativeDate(date);
            }
        }
    } else if (typeof date === 'number') {
        // date is PHP timestamp - i.e. in seconds
        let ts = date as number * 1000;

        // timestamp are UTC by definition
        result = DateTime.fromMillis(ts, {
            setZone: false
        });
    }

    if (!result || !result.isValid) {
        throw new TwingErrorRuntime(`Failed to parse date "${date}".`);
    }

    if (timezone !== false) {
        result = result.setZone(timezone);
    } else {
        if (parsedUtcOffset) {
            // explicit UTC offset
            result = result.setZone(`UTC+${parsedUtcOffset / 60}`);
        }
    }

    Reflect.set(result, 'format', function (format: string) {
        return formatDateTime(this, format);
    });

    return result;
}
