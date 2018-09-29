/**
 *
 * @param value
 * @returns {boolean}
 */
import {isNullOrUndefined} from "util";

/**
 * Check that an obejct is traversable in the sense of PHP,
 * i.e. implements PHP Traversable interface
 *
 * @param value
 * @returns {boolean}
 */
export function isTraversable(value: any) {
    if (!isNullOrUndefined(value)) {
        if (typeof value === 'string') {
            return false;
        }

        if (typeof value['entries'] === 'function') {
            return true;
        }

        if ((typeof value[Symbol.iterator] === 'function') || (typeof value['next'] === 'function')) {
            return true;
        }
    }

    return false;
}
