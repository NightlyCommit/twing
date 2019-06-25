import {isNullOrUndefined} from "util";
import {iteratorToMap} from "../../../helpers/iterator-to-map";

/**
 * Returns the keys for the given array.
 *
 * It is useful when you want to iterate over the keys of an array:
 *
 * <pre>
 *  {% for key in array|keys %}
 *      {# ... #}
 *  {% endfor %}
 * </pre>
 *
 * @param {Array<*>} array An array
 *
 * @returns {Array<*>} The keys
 */
export function twingFilterKeys(array: Array<any>) {
    let traversable;

    if (isNullOrUndefined(array)) {
        traversable = new Map();
    } else {
        traversable = iteratorToMap(array);
    }

    return [...traversable.keys()];
}
