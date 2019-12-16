import {TwingEnvironment} from "../../../environment";
import {TwingMarkup} from "../../../markup";
import {isNullOrUndefined} from "util";

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
    if (isNullOrUndefined(string) || string === '') {
        return Promise.resolve(string);
    }

    return Promise.resolve(words(string.toString()));
}
