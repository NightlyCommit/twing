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
 * @returns The reversed input
 */
export function reverse(env: TwingEnvironment, item: any, preserveKeys: boolean = false): string | Map<any, any> {
    if (typeof item === 'string') {
        return esrever.reverse(item);
    } else {
        return reverseHelper(iteratorToMap(item as Map<any, any>), preserveKeys);
    }
}
