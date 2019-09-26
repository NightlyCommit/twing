import {isMap} from "../../../helpers/is-map";

/**
 * Cycles over a value.
 *
 * @param {Map<any, any> | any} value
 * @param {number} position The cycle position
 *
 * @returns {any} The value at position
 */
export function cycle(value: Map<any, any> | any, position: number) {
    if (!isMap(value)) {
        return value;
    }

    return [...(value as Map<any, any>).values()][position % (value as Map<any, any>).size];
}
