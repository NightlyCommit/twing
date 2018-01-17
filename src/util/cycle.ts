/**
 * Cycles over a value.
 *
 * @param {Array} values
 * @param {number} position The cycle position
 *
 * @returns {string} The next value in the cycle
 */
export default function twingCycle(values: Array<any>, position: number) {
    if (!Array.isArray(values)) {
        return values;
    }

    return values[position % values.length];
}