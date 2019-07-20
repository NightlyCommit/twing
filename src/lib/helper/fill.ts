/**
 * Fill map with value until map's size is size.
 *
 * @param {Map<*, *>} map
 * @param {number} size
 * @param {any} value
 */
export function fill(map: Map<any, any>, size: number, value: any) {
    if (size > map.size) {
        let delta: number = size - map.size;

        // resolve the greatest numeric key
        let greatestNumericKey: number = NaN;

        for (let key of map.keys()) {
            let keyAsNumber: number = Number(key);

            if (Number.isInteger(keyAsNumber)) {
                if (Number.isNaN(greatestNumericKey) || keyAsNumber > greatestNumericKey) {
                    greatestNumericKey = keyAsNumber;
                }
            }
        }

        let start: number = Number.isNaN(greatestNumericKey) ? 0 : greatestNumericKey + 1;

        for (let i = start; i < start + delta; i++) {
            map.set(i, value);
        }
    }
}
