import {TwingEnvironment} from "../../../environment";
import {isTraversable} from "../../../helpers/is-traversable";
import {iteratorToMap} from "../../../helpers/iterator-to-map";
import {slice as sliceHelper} from "../../../helpers/slice";

/**
 * Slices a variable.
 *
 * @param item A variable
 * @param {number} start Start of the slice
 * @param {number} length Size of the slice
 * @param {boolean} preserveKeys Whether to preserve key or not (when the input is an object)
 *
 * @returns {Promise<string | Map<any, any>>} The sliced variable
 */
export function slice(item: any, start: number, length: number = null, preserveKeys: boolean = false): Promise<string | Map<any, any>> {
    if (isTraversable(item)) {
        let iterableItem = iteratorToMap(item);

        if (length === null) {
            length = iterableItem.size - start;
        }

        return Promise.resolve(sliceHelper(iterableItem, start, length, preserveKeys));
    }

    item = '' + (item ? item : '');

    if (length === null) {
        length = item.length - start;
    }

    return Promise.resolve(item.substr(start, length));
}
