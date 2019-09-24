/**
 * Cycles over a value.
 *
 * @param {any[] | any} values
 * @param {number} position The cycle position
 *
 * @returns {any} The value at position
 */
export function cycle(values: any[] | any, position: number) {
    if (!Array.isArray(values)) {
        return values;
    }

    return values[position % values.length];
}
