/**
 * Converts input to Map.
 *
 * @param {*} thing
 * @returns {Map<any, any>}
 */
export function iteratorToMap(thing: any): Map<any, any> {
    if (thing.entries) {
        return new Map(thing.entries());
    }
    else {
        let result: Map<any, any> = new Map();

        if (typeof thing[Symbol.iterator] === 'function') {
            let i: number = 0;

            for (let value of thing) {
                result.set(i++, value);
            }
        }
        else if (typeof thing['next'] === 'function') {
            let i: number = 0;
            let next: any;

            while ((next = thing.next()) && !next.done) {
                result.set(i++, next.value);
            }
        }
        else {
            for (let k in thing) {
                result.set(k, thing[k]);
            }
        }

        return result;
    }
}
