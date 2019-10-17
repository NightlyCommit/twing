import {TwingEnvironment} from "../../../environment";
import {TwingMarkup} from "../../../markup";

const words = require('capitalize');

/**
 * Returns a capitalized string.
 *
 * @param {TwingEnvironment} env
 * @param {string | TwingMarkup} string A string
 *
 * @returns {Promise<string>} The capitalized string
 */
export function capitalize(env: TwingEnvironment, string: string | TwingMarkup): Promise<string> {
    return Promise.resolve(words(string.toString()));
}
