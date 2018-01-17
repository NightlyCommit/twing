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
 * @param mixed value A variable
 *
 * @returns {boolean} true if the value is traversable
 */
export default function twingIsIterable(value: any) {
    if (typeof value === 'string') {
        return false;
    }

    return typeof value[Symbol.iterator] === 'function';
}