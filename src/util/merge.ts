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
 * @param array|Traversable $arr1 An array
 * @param array|Traversable $arr2 An array
 *
 * @return array The merged array
 */
const array_merge = require('locutus/php/array/array_merge');

import ensureIterable from '../util/ensure-iterable';

export default function twingMerge(arr1: any, arr2:any) {
    if (Array.isArray(arr1) && Array.isArray(arr2)) {
        return array_merge(arr1, arr2);
    }

    // if ($arr1 instanceof Traversable) {
    //     $arr1 = iterator_to_array($arr1);
    // } elseif (!is_array($arr1)) {
    //     throw new Twig_Error_Runtime(sprintf('The merge filter only works with arrays or "Traversable", got "%s" as first argument.', gettype($arr1)));
    // }
    //
    // if ($arr2 instanceof Traversable) {
    //     $arr2 = iterator_to_array($arr2);
    // } elseif (!is_array($arr2)) {
    //     throw new Twig_Error_Runtime(sprintf('The merge filter only works with arrays or "Traversable", got "%s" as second argument.', gettype($arr2)));
    // }

    let arr1AsTraversable = ensureIterable(arr1);
    let arr2AsTraversable = ensureIterable(arr2);

    return arr1AsTraversable.merge(arr2AsTraversable);
}