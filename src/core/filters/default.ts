import {twingTestEmpty} from "../tests/empty";

/**
 * @internal
 */
export function twingFilterDefault(value: any, defaultValue: any = '') {
    if (twingTestEmpty(value)) {
        return defaultValue;
    }

    return value;
}
