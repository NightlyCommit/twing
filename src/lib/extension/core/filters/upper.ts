import {TwingMarkup} from "../../../markup";

/**
 * Converts a string to uppercase.
 *
 * @param {string | TwingMarkup} string A string
 *
 * @returns {Promise<string>} The uppercased string
 */
export function upper(string: string | TwingMarkup): Promise<string> {
    return Promise.resolve(string.toString().toUpperCase());
}
