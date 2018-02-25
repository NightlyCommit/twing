/**
 *
 * @param value
 * @returns {boolean}
 */
import {isNullOrUndefined} from "util";

export function isTraversable(value: any) {
    if (!isNullOrUndefined(value)) {
        if (typeof value === 'string') {
            return false;
        }

        if (typeof value['entries'] === 'function') {
            return true;
        }

        if (typeof value[Symbol.iterator] === 'function') {
            return true;
        }

        if (typeof value === 'object') {
            return true;
        }
    }

    return false;
}
