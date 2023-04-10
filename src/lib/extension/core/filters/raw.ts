import {TwingMarkup} from "../../../markup";

/**
 * Marks a variable as being safe.
 *
 * @param {string | TwingMarkup} string A variable
 *
 * @return {Promise<string>}
 */
export function raw(string: string | TwingMarkup | null): Promise<string> {
    return Promise.resolve(string !== null ? string.toString() : '');
}
