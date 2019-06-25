/**
 * Clone a map.
 *
 * @param {Map<K, V>} map
 * @returns {Map<K, V>}
 */
export function cloneMap<K, V>(map: Map<K, V>): Map<K, V> {
    let result = new Map();

    for (let [key, value] of map) {
        result.set(key, value);
    }

    return result;
}
