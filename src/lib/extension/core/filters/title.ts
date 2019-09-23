import {TwingEnvironment} from "../../../environment";
import {TwingMarkup} from "../../../markup";

const ucwords = require('locutus/php/strings/ucwords');

/**
 * Returns a titlecased string.
 *
 * @param {TwingEnvironment} env
 * @param {string | TwingMarkup} string A string
 *
 * @returns {string} The titlecased string
 */
export function title(env: TwingEnvironment, string: string | TwingMarkup) {
    return ucwords(string.toString().toLowerCase());
}
