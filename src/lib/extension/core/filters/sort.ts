import {isTraversable} from "../../../helpers/is-traversable";
import {TwingErrorRuntime} from "../../../error/runtime";
import {iteratorToMap} from "../../../helpers/iterator-to-map";
import {asort} from "../../../helpers/asort";

/**
 * Sorts an array.
 *
 * @param {Array<*>} array
 *
 * @returns {Map<*,*>}
 */
export function twingFilterSort(array: Array<any>) {
    if (!isTraversable(array) && !Array.isArray(array)) {
        throw new TwingErrorRuntime(`The sort filter only works with iterables, got "${typeof array}".`);
    }

    let map = iteratorToMap(array);

    asort(map);

    return map;
}
