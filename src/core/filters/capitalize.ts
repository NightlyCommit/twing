import {TwingEnvironment} from "../../environment";

const capitalize = require('capitalize');

/**
 * Returns a capitalized string.
 *
 * @param {TwingEnvironment} env
 * @param {string} string A string
 *
 * @returns {string} The capitalized string
 */
export function twingFilterCapitalize(env: TwingEnvironment, string: string) {
    return capitalize(string);
}
