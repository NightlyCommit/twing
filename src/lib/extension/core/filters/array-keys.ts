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
 * @param {Array<any>} array An array
 *
 * @returns {Promise<Array<any>>} The keys
 */

export function arrayKeys(array: Array<any>): Promise<Array<any>> {
    let traversable;

    if (isNullOrUndefined(array)) {
        traversable = new Map();
    } else {
        traversable = iteratorToMap(array);
    }

    return Promise.resolve([...traversable.keys()]);
}
