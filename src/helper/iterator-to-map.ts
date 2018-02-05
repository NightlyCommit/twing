/**
 * Converts input to TwingMap.
 *
 * @param seq
 * @returns {TwingMap<any, any>}
 */
import TwingMap from "../map";

export function iteratorToMap(thing: any): TwingMap<any, any> {
    if (thing.entries) {
        return new TwingMap(thing.entries());
    }
    else {
        let result: TwingMap<any, any> = new TwingMap();

        if (typeof thing[Symbol.iterator] === 'function') {
            for (let value of thing) {
                result.push(value);
            }
        }
        else if (typeof thing === 'object') {
            for (let k in thing) {
                result.set(k, thing[k]);
            }
        }

        return result;
    }
}

export default iteratorToMap;