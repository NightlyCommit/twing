import {merge as mergeHelper} from "../../../helpers/merge";
import {isNullOrUndefined} from "util";
import {isTraversable} from "../../../helpers/is-traversable";
import {TwingErrorRuntime} from "../../../error/runtime";
import {iteratorToMap} from "../../../helpers/iterator-to-map";

/**
 * Merges an array with another one.
 *
 * <pre>
 *  {% set items = { 'apple': 'fruit', 'orange': 'fruit' } %}
 *
 *  {% set items = items|merge({ 'peugeot': 'car' }) %}
 *
 *  {# items now contains { 'apple': 'fruit', 'orange': 'fruit', 'peugeot': 'car' } #}
 * </pre>
 *
 * @param {any} iterable1 An iterable
 * @param {any} iterable2 An iterable
 *
 * @return {Promise<Map<any, any>>} The merged map
 */
export function merge(iterable1: any, iterable2: any): Promise<Map<any, any>> {
    if (isNullOrUndefined(iterable1) || (!isTraversable(iterable1) && (typeof iterable1 !== 'object'))) {
        throw new TwingErrorRuntime(`The merge filter only works with arrays or "Traversable", got "${!isNullOrUndefined(iterable1) ? typeof iterable1 : iterable1}" as first argument.`);
    }

    if (isNullOrUndefined(iterable2) || (!isTraversable(iterable2) && (typeof iterable2 !== 'object'))) {
        throw new TwingErrorRuntime(`The merge filter only works with arrays or "Traversable", got "${!isNullOrUndefined(iterable2) ? typeof iterable2 : iterable2}" as second argument.`);
    }

    return Promise.resolve(mergeHelper(iteratorToMap(iterable1), iteratorToMap(iterable2)));
}
