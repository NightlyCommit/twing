/**
 * Slices a variable.
 *
 * @param {TwingEnvironment} env
 * @param item A variable
 * @param {number} start Start of the slice
 * @param {number} length Size of the slice
 * @param {boolean} preserveKeys Whether to preserve key or not (when the input is an object)
 *
 * @returns The sliced variable
 */
import TwingEnvironment from "../environment";
import TwingMap from "../map";

import ensureIterable from './ensure-iterable';

export default function twingSlice(env: TwingEnvironment, item: any, start: number, length: number = null, preserveKeys: boolean = false): string | TwingMap<any, any> {

    if (typeof item === 'string') {
        if (length === null) {
            length = item.length - start;
        }

        return item.substr(start, length);
    }
    else {
        let iterableItem = ensureIterable(item);

        if (length === null) {
            length = iterableItem.size - start;
        }

        return iterableItem.slice(start, length, Array.isArray(item) ? preserveKeys : true);
    }
}