/**
 * Sorts an array.
 *
 * @param any array
 *
 * @returns any
 */
import TwingErrorRuntime from "../error/runtime";

import isIterable from '../util/is-iterable';
import ensureIterable from '../util/ensure-iterable';

export default function twingSort(array: any) {
    if (!isIterable(array) && !Array.isArray(array)) {
        throw new TwingErrorRuntime(`The sort filter only works with iterables, got "${typeof array}".`);
    }

    array = ensureIterable(array).sort();

    return array;
}