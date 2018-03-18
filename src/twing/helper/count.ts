/**
 *
 * @param {*} countable
 * @returns {number}
 */
export function count(countable: any) {
    return Array.isArray(countable) ? countable.length : countable.size;
}
