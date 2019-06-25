import {TwingEnvironment} from "../../../environment";
import {isTraversable} from "../../../helpers/is-traversable";
import {iteratorToMap} from "../../../helpers/iterator-to-map";
import {slice} from "../../../helpers/slice";

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
export function twingFilterSlice(env: TwingEnvironment, item: any, start: number, length: number = null, preserveKeys: boolean = false): string | Map<any, any> {
    if (isTraversable(item)) {
        let iterableItem = iteratorToMap(item);

        if (length === null) {
            length = iterableItem.size - start;
        }

        return slice(iterableItem, start, length, preserveKeys);
    }

    item = '' + (item ? item : '');

    if (length === null) {
        length = item.length - start;
    }

    return item.substr(start, length);
}
