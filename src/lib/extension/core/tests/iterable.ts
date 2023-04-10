/**
 * Checks if a variable is traversable.
 *
 * <pre>
 * {# evaluates to true if the foo variable is an array or a traversable object #}
 * {% if foo is iterable %}
 *     {# ... #}
 * {% endif %}
 * </pre>
 *
 * @param value A variable
 *
 * @return {Promise<boolean>} true if the value is traversable
 */
export function iterable(value: any): Promise<boolean> {
    let _do = (): boolean => {
        /*
            Prevent `(null)[Symbol.iterator]`/`(undefined)[Symbol.iterator]` error,
            and return `false` instead.

            Note that `value` should only be `undefined` if it's been explicitly
            set to that (e.g., in the JavaScript that provided the calling template
            with the context). Values that are simply "not defined" will either have
            been coerced to `null` or thrown a "does not exist" runtime error before
            this function is called (depending on whether `strict_variables` is enabled).

            This *does* mean that an explicitly `undefined` value will return `false`
            instead of throwing an error if `strict_variables` is enabled, which is
            probably unexpected behavior, but short of some major refactoring to allow
            an environmental check here, the alternative is to have `undefined`
            throw an error even when `strict_variables` is disabled, and that unexpected
            behavior seems worse.
        */
        if (value === null || value === undefined) {
            return false;
        }

        // for Twig, a string is not traversable
        if (typeof value === 'string') {
            return false;
        }

        if (typeof value[Symbol.iterator] === 'function') {
            return true;
        }

        // in PHP objects are not iterable so we have to ensure that the test reflects that
        return false;
    };

    return Promise.resolve(_do());
}
