import {TwingEnvironment} from "../../../environment";
import {TwingMarkup} from "../../../markup";

/**
 * Converts a string to uppercase.
 *
 * @param {TwingEnvironment} env
 * @param {string | TwingMarkup} string A string
 *
 * @returns {Promise<string>} The uppercased string
 */
export function upper(env: TwingEnvironment, string: string | TwingMarkup): Promise<string> {
    return Promise.resolve(string.toString().toUpperCase());
}
