/**
 * Converts input to TwingMap.
 *
 * @param seq
 * @returns {TwingMap<any, any>}
 */
import TwingMap from "../map";

export default function twingEnsureIterable(seq: any): TwingMap<any, any> {
    let result: TwingMap<any, any> = new TwingMap();

    if (seq) {
        if (typeof seq[Symbol.iterator] === 'function') {
            // iterator
            result = new TwingMap();

            let index = 0;

            if (Array.isArray(seq)) {
                for (let value of seq) {
                    result.set(index++, value);
                }
            }
            else {
                for (let itVal of seq) {
                    let key: any;
                    let value: any;

                    if (Array.isArray(itVal)) {
                        key = itVal[0];
                        value = itVal[1];
                    }
                    else {
                        key = index++;
                        value = itVal;
                    }

                    result.set(key, value);
                }
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