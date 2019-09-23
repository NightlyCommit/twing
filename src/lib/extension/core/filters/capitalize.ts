import {TwingEnvironment} from "../../../environment";
import {TwingMarkup} from "../../../markup";

const words = require('capitalize');

/**
 * Returns a capitalized string.
 *
 * @param {TwingEnvironment} env
 * @param {string | TwingMarkup} string A string
 *
 * @returns {string} The capitalized string
 */
export function capitalize(env: TwingEnvironment, string: string | TwingMarkup) {
    return words(string.toString());
}
