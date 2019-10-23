import {iteratorToArray} from "../../../helpers/iterator-to-array";

const isPlainObject = require('is-plain-object');

/**
 * Checks if a variable is empty.
 *
 * <pre>
 * {# evaluates to true if the foo variable is null, false, or the empty string #}
 * {% if foo is empty %}
 *     {# ... #}
 * {% endif %}
 * </pre>
 *
 * @param value A variable
 *
 * @returns {boolean} true if the value is empty, false otherwise
 */
export function empty(value: any): Promise<boolean> {
    if (value === null || value === undefined) {
        return Promise.resolve(true);
    }

    if (typeof value === 'string') {
        return Promise.resolve(value.length < 1);
    }

    if (typeof value[Symbol.iterator] === 'function') {
        return Promise.resolve(value[Symbol.iterator]().next().done === true);
    }

    if (isPlainObject(value)) {
        if (value.hasOwnProperty('toString') && typeof value.toString === 'function') {
            return empty(value.toString());
        }
        else {
            return Promise.resolve(iteratorToArray(value).length < 1);
        }
    }

    if (typeof value === 'object' && value.toString && typeof value.toString === 'function') {
        return empty(value.toString());
    }

    return Promise.resolve(value === false);
}
