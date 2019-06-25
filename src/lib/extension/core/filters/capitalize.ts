import {TwingEnvironment} from "../../../environment";

const words = require('capitalize');

/**
 * Returns a capitalized string.
 *
 * @param {TwingEnvironment} env
 * @param {string} string A string
 *
 * @returns {string} The capitalized string
 */
export function capitalize(env: TwingEnvironment, string: string) {
    return words(string);
}
