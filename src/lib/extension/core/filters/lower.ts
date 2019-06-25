import {TwingEnvironment} from "../../../environment";

/**
 * Converts a string to lowercase.
 *
 * @param {TwingEnvironment} env
 * @param {string} string A string
 *
 * @returns {string} The lowercased string
 */
export function twingFilterLower(env: TwingEnvironment, string: string) {
    return (typeof string === 'string') ? string.toLowerCase() : string;
}
