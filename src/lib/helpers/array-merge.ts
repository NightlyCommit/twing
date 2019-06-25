import {merge} from "./merge";

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
export function arrayMerge(arr1: any, arr2: any) {
    return merge(arr1, arr2);
}
