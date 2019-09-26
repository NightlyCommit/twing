import {TwingMarkup} from "../../../markup";

/**
 * Marks a variable as being safe.
 *
 * @param {string | TwingMarkup} string A variable
 *
 * @return string
 */
export function raw(string: string | TwingMarkup) {
    return string.toString();
}
