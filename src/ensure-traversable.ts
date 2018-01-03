/**
 * Converts input to ES6 Map.
 *
 * @param seq
 * @returns {Map<any, any>}
 */
export = function (seq: any): Map<any, any> {
    let result: Map<any, any> = new Map();

    if (seq) {
        if (typeof seq[Symbol.iterator] === 'function') {
            // iterator: Array, Map, Set...
            result = new Map();

            let index: number = 0;

            for (let v of seq) {
                let key: any;
                let value: any;

                if (Array.isArray(v)) {
                    if (v.length > 1) {
                        key = v[0];
                        value = v[1];
                    }
                    else {
                        key = index;
                        value = v[0];
                    }
                }
                else {
                    key = index;
                    value = v;
                }

                result.set(key, value);

                index++;
            }
        }
        else if (typeof seq === 'object') {
            for (let k in seq) {
                result.set(k, seq[k]);
            }
        }
    }

    return result;
}