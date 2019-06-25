import {isNullOrUndefined} from "util";
import {isTraversable} from "../../../helpers/is-traversable";
import {iteratorToArray} from "../../../helpers/iterator-to-array";

/**
 * Joins the values to a string.
 *
 * The separator between elements is an empty string per default, you can define it with the optional parameter.
 *
 * <pre>
 *  {{ [1, 2, 3]|join('|') }}
 *  {# returns 1|2|3 #}
 *
 *  {{ [1, 2, 3]|join }}
 *  {# returns 123 #}
 * </pre>
 *
 * @param {Array<*>} value An array
 * @param {string} glue The separator
 * @param {string | null} and The separator for the last pair
 *
 * @returns {string} The concatenated string
 */
export function twingFilterJoin(value: Array<any>, glue: string = '', and: string = null) {
    if (isNullOrUndefined(value)) {
        return '';
    }

    if (isTraversable(value)) {
        value = iteratorToArray(value, false);

        // this is ugly but we have to ensure that each element of the array is rendered as PHP would render it
        // this is mainly useful for booleans that are not rendered the same way in PHP and JavaScript
        let safeValue = value.map(function (item) {
            if (typeof item === 'boolean') {
                return (item === true) ? '1' : ''
            }

            return item;
        });


        if (and === null || and === glue) {
            return safeValue.join(glue);
        }

        if (safeValue.length === 1) {
            return safeValue[0];
        }

        return safeValue.slice(0, -1).join(glue) + and + safeValue[safeValue.length - 1];
    }

    return '';
}
