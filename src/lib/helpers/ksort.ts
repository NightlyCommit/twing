/**
 * Sort a map by key
 *
 * @param {Map<*, *>} map
 * @param {Function} handler
 */
export function ksort(map: Map<any, any>, handler: any = undefined): void {
    let sortedMap = new Map();

    let sortedKeys = [...map.keys()].sort(handler);

    for (let key of sortedKeys) {
        sortedMap.set(key, map.get(key));
    }

    map.clear();

    for (let [key, value] of sortedMap) {
        map.set(key, value);
    }
}
