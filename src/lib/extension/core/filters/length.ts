import {TwingEnvironment} from "../../../environment";
import {isNullOrUndefined} from "util";

/**
 * Returns the length of a thing.
 *
 * @param {TwingEnvironment} env A TwingEnvironment instance
 * @param {any} thing A thing
 *
 * @returns {Promise<number>} The length of the thing
 */
export function length(env: TwingEnvironment, thing: any): Promise<number> {
    let length: number;

    if (isNullOrUndefined(thing)) {
        length = 0;
    } else if (thing.length !== undefined) {
        length = thing.length;
    } else if (thing.size !== undefined) {
        length = thing.size;
    } else if (thing.toString && (typeof thing.toString === 'function')) {
        length = thing.toString().length;
    } else {
        length = 1;
    }

    return Promise.resolve(length);
}
