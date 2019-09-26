import {isTraversable} from "../../../helpers/is-traversable";
import {TwingErrorRuntime} from "../../../error/runtime";
import {iteratorToMap} from "../../../helpers/iterator-to-map";
import {asort} from "../../../helpers/asort";

/**
 * Sorts an iterable.
 *
 * @param {Map<any, any>} iterable
 *
 * @returns {Map<any, any>}
 */
export function sort(iterable: Map<any, any>) {
    if (!isTraversable(iterable)) {
        throw new TwingErrorRuntime(`The sort filter only works with iterables, got "${typeof iterable}".`);
    }

    let map = iteratorToMap(iterable);

    asort(map);

    return map;
}
