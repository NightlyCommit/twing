import {TwingEnvironment} from "../../../environment";
import {isNullOrUndefined} from "util";

/**
 * Returns the length of a variable.
 *
 * @param {TwingEnvironment} env A TwingEnvironment instance
 * @param thing A variable
 *
 * @returns {Promise<number>} The length of the value
 */
export function length(env: TwingEnvironment, thing: any): Promise<number> {
    let _do = (): number => {
        if (isNullOrUndefined(thing)) {
            return 0;
        }

        if (thing.length) {
            return thing.length;
        }

        if (thing.size) {
            return thing.size;
        }

        if (thing.toString && (typeof thing.toString === 'function')) {
            return thing.toString().length;
        }

        return 1;
    };

    return Promise.resolve(_do());
}
