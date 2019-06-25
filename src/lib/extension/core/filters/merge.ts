import {arrayMerge} from "../../../helpers/array-merge";
import {isNullOrUndefined} from "util";
import {isTraversable} from "../../../helpers/is-traversable";
import {TwingErrorRuntime} from "../../../error/runtime";

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
 * @param {*} arr1 An array
 * @param {*} arr2 An array
 *
 * @return array The merged array
 */
export function twingFilterMerge(arr1: any, arr2: any) {
    if (isNullOrUndefined(arr1) || (!isTraversable(arr1) && (typeof arr1 !== 'object'))) {
        throw new TwingErrorRuntime(`The merge filter only works with arrays or "Traversable", got "${!isNullOrUndefined(arr1) ? typeof arr1 : arr1}" as first argument.`);
    }

    if (isNullOrUndefined(arr2) || (!isTraversable(arr2) && (typeof arr2 !== 'object'))) {
        throw new TwingErrorRuntime(`The merge filter only works with arrays or "Traversable", got "${!isNullOrUndefined(arr2) ? typeof arr2 : arr2}" as second argument.`);
    }

    return arrayMerge(arr1, arr2);
}
