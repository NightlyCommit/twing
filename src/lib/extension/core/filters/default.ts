import {empty} from "../tests/empty";

/**
 * @internal
 */
export function defaultFilter(value: any, defaultValue: any = '') {
    if (empty(value)) {
        return defaultValue;
    }

    return value;
}
