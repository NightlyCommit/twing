/**
 *
 * @param value
 * @returns {boolean}
 */
export default function isTraversable(value: any) {
    if (value !== null) {
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