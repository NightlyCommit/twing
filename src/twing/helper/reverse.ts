/**
 * Reverse a map
 *
 * @param {Map<* ,*>} map
 * @param {boolean} preserveKeys
 *
 * @returns Map
 */
export function reverse(map: Map<any, any>, preserveKeys: boolean = false) {
    let result = new Map();
    let keys = [...map.keys()];

    for (let i = (keys.length - 1); i >= 0; i--) {
        let key = keys[i];

        result.set(key, map.get(key));
    }

    return result;
}
