import {TwingEnvironment} from "../../../environment";
import {reverse as reverseHelper} from "../../../helpers/reverse";
import {iteratorToMap} from "../../../helpers/iterator-to-map";

const esrever = require('esrever');

/**
 * Reverses a variable.
 *
 * @param {TwingEnvironment} env
 * @param {string | Map<*, *>} item A traversable instance, or a string
 * @param {boolean} preserveKeys Whether to preserve key or not
 *
 * @returns {Promise<string | Map<any, any>>} The reversed input
 */
export function reverse(env: TwingEnvironment, item: any, preserveKeys: boolean = false): Promise<string | Map<any, any>> {
    if (typeof item === 'string') {
        return Promise.resolve(esrever.reverse(item));
    } else {
        return Promise.resolve(reverseHelper(iteratorToMap(item as Map<any, any>), preserveKeys));
    }
}
