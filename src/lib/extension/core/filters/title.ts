import {TwingMarkup} from "../../../markup";

const ucwords = require('locutus/php/strings/ucwords');

/**
 * Returns a title-cased string.
 *
 * @param {string | TwingMarkup} string A string
 *
 * @returns {Promise<string>} The title-cased string
 */
export function title(string: string | TwingMarkup): Promise<string> {
    let result: string = ucwords(string.toString().toLowerCase());

    return Promise.resolve(result);
}
