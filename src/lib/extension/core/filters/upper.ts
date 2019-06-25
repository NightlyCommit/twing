import {TwingEnvironment} from "../../../environment";

/**
 * Converts a string to uppercase.
 *
 * @param {TwingEnvironment} env
 * @param {string} string A string
 *
 * @returns {string} The uppercased string
 */
export function twingFilterUpper(env: TwingEnvironment, string: string) {
    return (typeof string === 'string') ? string.toUpperCase() : string;
}
