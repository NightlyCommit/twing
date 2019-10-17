/**
 * Return the absolute value of a number.
 *
 * @param {number} x
 * @returns {Promise<number>}
 */
export function abs(x: number): Promise<number> {
    return Promise.resolve(Math.abs(x));
}
