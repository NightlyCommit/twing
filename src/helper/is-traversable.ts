/**
 * Checks if a variable is traversable.
 *
 * <pre>
 * {# evaluates to true if the foo variable is a traversable object #}
 * {% if foo is iterable %}
 *     {# ... #}
 * {% endif %}
 * </pre>
 *
 * @param {any} value A variable
 *
 * @returns {boolean} true if the value is traversable
 */
export default function isTraversable(value: any) {
    if (value !== null) {
        // in PHP strings are traversable
        if (typeof value === 'string') {
            return false;
        }

        if (typeof value[Symbol.iterator] === 'function') {
            return true;
        }
    }

    return false;
}