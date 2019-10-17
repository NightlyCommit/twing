import {TwingEnvironment} from "../../../environment";
import {TwingMarkup} from "../../../markup";

const ucwords = require('locutus/php/strings/ucwords');

/**
 * Returns a title-cased string.
 *
 * @param {TwingEnvironment} env
 * @param {string | TwingMarkup} string A string
 *
 * @returns {Promise<string>} The title-cased string
 */
export function title(env: TwingEnvironment, string: string | TwingMarkup): Promise<string> {
    let result: string = ucwords(string.toString().toLowerCase());

    return Promise.resolve(result);
}
