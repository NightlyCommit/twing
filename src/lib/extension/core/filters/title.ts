import {TwingEnvironment} from "../../../environment";

const ucwords = require('locutus/php/strings/ucwords');

/**
 * Returns a titlecased string.
 *
 * @param {TwingEnvironment} env
 * @param {string} string A string
 *
 * @returns {string} The titlecased string
 */
export function twingFilterTitle(env: TwingEnvironment, string: string) {
    return ucwords(string.toLowerCase());
}
