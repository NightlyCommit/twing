/**
 * Cycles over a value.
 *
 * @param {Array} values
 * @param {number} position The cycle position
 *
 * @returns {string} The next value in the cycle
 */
export function twingFunctionCycle(values: Array<any>, position: number) {
    if (!Array.isArray(values)) {
        return values;
    }

    return values[position % values.length];
}
