/**
 * Clone a map.
 *
 * @param {Map<*, *>} map
 * @returns {Map<*, *>}
 */
export function clone(map: Map<any, any>) {
    let result = new Map();

    for (let [key, value] of map) {
        result.set(key, value);
    }

    return result;
}
