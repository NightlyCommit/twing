import {TwingEnvironment} from "../../../environment";
import {reverse} from "../../../helpers/reverse";
import {iteratorToMap} from "../../../helpers/iterator-to-map";

/**
 * Reverses a variable.
 *
 * @param {TwingEnvironment} env
 * @param {string | Map<*, *>} item A traversable instance, or a string
 * @param {boolean} preserveKeys Whether to preserve key or not
 *
 * @returns The reversed input
 */
export function twingFilterReverse(env: TwingEnvironment, item: any, preserveKeys: boolean = false): string | Map<any, any> {
    if (typeof item === 'string') {
        let esrever = require('esrever');

        return esrever.reverse(item);
    } else {
        return reverse(iteratorToMap(item as Map<any, any>), preserveKeys);
    }
}
