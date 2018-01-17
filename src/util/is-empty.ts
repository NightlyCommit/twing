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
export default function twingIsEmpty(value: any): boolean {
    if (value === null || value === undefined) {
        return true;
    }

    if (typeof value[Symbol.iterator] === 'function') {
        return value[Symbol.iterator]().next().done === true;
    }

    if (typeof value === 'object' && value.toString && typeof value.toString === 'function') {
        return value.toString().length < 1;
    }

    return value === false;
};